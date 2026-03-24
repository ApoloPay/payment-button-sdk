import 'dart:async';
import 'dart:math';
import 'package:apolopay_sdk/utils/amount_formatter.dart';
import 'package:apolopay_sdk/utils/build_rich_text.dart';
import 'package:apolopay_sdk/widgets/Info_modal.dart';
import 'package:apolopay_sdk/widgets/scrollbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:apolopay_sdk/i18n/i18n.dart';
import 'package:apolopay_sdk/models/client_response.dart';
import 'package:apolopay_sdk/models/asset.dart';
import 'package:apolopay_sdk/models/network.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:convert';
import 'package:apolopay_sdk/assets/logo_apolo.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/apolopay_service.dart';

enum ModalStep { selectAsset, selectNetwork, showQr, processing, result }

class ApoloPayModal extends StatefulWidget {
  final ApoloPayOptions options;
  final I18nLocale? locale;
  final String productTitle;
  final Function(ClientError)? onExpired;

  const ApoloPayModal({
    super.key,
    required this.options,
    this.locale,
    this.productTitle = '',
    this.onExpired,
  });

  static Future<void> show(
    BuildContext context,
    ApoloPayOptions options, {
    I18nLocale? locale,
    String productTitle = '',
    Function(ClientError)? onExpired,
  }) {
    final bool isDesktop = MediaQuery.of(context).size.width > 880;

    final child = ApoloPayModal(
      options: options,
      locale: locale,
      productTitle: productTitle,
      onExpired: onExpired,
    );

    if (isDesktop) {
      return showDialog(
        context: context,
        builder: (context) => Dialog(
          backgroundColor: Colors.transparent,
          insetPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480, maxHeight: 800),
            child: child,
          ),
        ),
      );
    }

    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => child,
    );
  }

  @override
  State<ApoloPayModal> createState() => _ApoloPayModalState();
}

class _ApoloPayModalState extends State<ApoloPayModal>
    with SingleTickerProviderStateMixin {
  final scrollControllerAssets = ScrollController();
  final scrollControllerNetworks = ScrollController();
  final scrollControllerQr = ScrollController();

  late ApoloPayService _service;
  ModalStep _currentStep = ModalStep.selectAsset;
  bool _isLoading = true;
  List<Asset> _assets = [];
  Asset? _selectedAsset;
  Network? _selectedNetwork;
  QrResponseData? _qrData;
  ClientResponseBase? _finalResult;
  Timer? _timer;
  bool _isCopied = false;
  final StreamController<String> _timerController =
      StreamController<String>.broadcast();

  @override
  void initState() {
    super.initState();
    _service = ApoloPayService(ApoloPayOptions(
      client: widget.options.client,
      processId: widget.options.processId,
      onSuccess: (res) {
        _currentStep = ModalStep.processing;
        if (mounted) setState(() {});

        Future.delayed(const Duration(seconds: 2), () {
          _finalResult = res;
          _currentStep = ModalStep.result;
          if (mounted) setState(() {});
        });
      },
      onPartialPayment: (res) {
        _finalResult = res;
        _currentStep = ModalStep.showQr;
        if (mounted) setState(() {});
      },
      onError: (err) {
        _finalResult = err;
        _currentStep = ModalStep.result;
        if (mounted) setState(() {});
      },
    ));
    _loadAssets();
  }

  Future<void> _loadAssets() async {
    try {
      final assets = await _service.getAssets();
      _assets = assets;
      _isLoading = false;
      if (mounted) setState(() {});
    } on ClientError catch (err) {
      debugPrint('Error loading assets: ${err.message}');
      _isLoading = false;
      if (mounted) setState(() {});
    }
  }

  void _startTimer(int expiresAtMs) {
    _timer?.cancel();

    _updateTimerStream(expiresAtMs);

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _updateTimerStream(expiresAtMs);
    });
  }

  void _updateTimerStream(int expiresAtMs) {
    final now = DateTime.now().millisecondsSinceEpoch;
    final distance = expiresAtMs - now;

    if (distance <= 0) {
      _handleTimerExpired();
      return;
    }

    final minutes = distance ~/ 60000;
    final seconds = (distance % 60000) ~/ 1000;

    final minLabel = I18n.t.modal.labels.minutes;
    final secLabel = I18n.t.modal.labels.seconds;

    final m = minutes.toString().padLeft(2, '0');
    final s = seconds.toString().padLeft(2, '0');

    _timerController.add('$m $minLabel : $s $secLabel');
  }

  @override
  void dispose() {
    _timer?.cancel();
    _timerController.close();
    _service.disconnectWebSocket();
    super.dispose();
  }

  void _handleTimerExpired() {
    final minLabel = I18n.t.modal.labels.minutes;
    final secLabel = I18n.t.modal.labels.seconds;

    _timer?.cancel();
    _timerController.add('00 $minLabel : 00 $secLabel');

    _currentStep = ModalStep.result;
    _finalResult = ClientError(
      code: ClientCode.paymentTimeout,
      message: I18n.t.errors.timeout,
    );
    if (mounted) setState(() {});
  }

  void _handleClose([bool didPop = false]) {
    if (!didPop) Navigator.pop(context);

    if (_finalResult is ClientResponse) {
      switch (_finalResult?.code) {
        case ClientCode.paymentPartial:
          widget.options.onPartialPayment?.call(
            _finalResult as ClientResponse<PartialPaymentResponseData>,
          );
          break;

        default:
          widget.options.onSuccess?.call(
            _finalResult as ClientResponse<QrResponseData>,
          );
          break;
      }
    }

    if (_finalResult is ClientError) {
      switch (_finalResult?.code) {
        case ClientCode.paymentTimeout:
          widget.onExpired?.call(_finalResult as ClientError);
          break;

        default:
          widget.options.onError?.call(_finalResult as ClientError);
          break;
      }
    }
  }

  Future<void> handleSelectNetwork(Network network) async {
    if (network.network != 'apolopay') {
      final response = await InfoModal.show(
        context,
        title: I18n.t.modal.info.disclaimerTitle,
        content: (context, style) {
          return buildRichText(
            I18n.t.modal.info.disclaimerConfirmation,
            baseStyle: style,
          );
        },
      );
      if (response != true) return;
    }

    setState(() => _isLoading = true);

    try {
      final qrData = await _service.fetchQrCodeDetails(
        assetId: _selectedAsset!.id,
        networkId: network.id,
      );
      _qrData = qrData;
      _selectedNetwork = network;
      _currentStep = ModalStep.showQr;
      _isLoading = false;

      if (mounted) setState(() {});
      _startTimer(qrData.expiresAtMs);
    } on ClientError catch (err) {
      if (err.code == ClientCode.paymentProcessNotAvailable) {
        _finalResult = err;
        _currentStep = ModalStep.result;
        _isLoading = false;
        if (mounted) setState(() {});
        return;
      }

      debugPrint('Error fetching QR details: ${err.message}');

      _isLoading = false;
      if (mounted) setState(() {});
    }
  }

  Future<void> _handlePayFromDevice() async {
    final targetUrl = _qrData?.paymentUrl;

    if (targetUrl == null) return;

    final uri = Uri.parse(targetUrl);
    try {
      await launchUrl(uri);
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }

  Widget _buildRichText(String text,
      {TextStyle? baseStyle, TextAlign textAlign = TextAlign.start}) {
    final List<TextSpan> spans = [];
    final RegExp regExp = RegExp(r'(<[^>]+>|[^<]+)');
    final Iterable<Match> matches = regExp.allMatches(text);

    bool isHighlight = false;
    bool isBold = false;

    for (final match in matches) {
      final String part = match.group(0)!;
      if (part.startsWith('<')) {
        final tag = part.toLowerCase();
        if (tag.contains('highlight')) {
          isHighlight = true;
        } else if (tag == '</span>') {
          isHighlight = false;
        } else if (tag == '<strong>') {
          isBold = true;
        } else if (tag == '</strong>') {
          isBold = false;
        } else if (tag.startsWith('<br')) {
          spans.add(const TextSpan(text: '\n'));
        }
      } else {
        spans.add(TextSpan(
          text: part,
          style: TextStyle(
            color: isHighlight || isBold ? const Color(0xFFEA580C) : null,
            fontWeight: isBold || isHighlight ? FontWeight.bold : null,
          ),
        ));
      }
    }

    return RichText(
      textAlign: textAlign,
      text: TextSpan(
        style: baseStyle ??
            const TextStyle(color: Color(0xFF1C315C), fontSize: 14),
        children: spans,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isDesktop = MediaQuery.of(context).size.width > 880;

    return PopScope(
      onPopInvokedWithResult: (didPop, result) => _handleClose(didPop),
      child: Container(
        height: isDesktop ? null : MediaQuery.of(context).size.height * 0.9,
        decoration: BoxDecoration(
          color: const Color(0xFFF6F2EC),
          borderRadius: isDesktop
              ? BorderRadius.circular(24)
              : const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(children: [
          _buildHeader(),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _buildCurrentStep(),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ]),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _currentStep != ModalStep.selectAsset &&
                  _currentStep != ModalStep.result
              ? IconButton(
                  icon: const Icon(Icons.arrow_back, color: Color(0xFF9CA3AF)),
                  onPressed: () {
                    setState(() {
                      if (_currentStep == ModalStep.selectNetwork) {
                        _currentStep = ModalStep.selectAsset;
                      }
                      if (_currentStep == ModalStep.showQr) {
                        _currentStep = ModalStep.selectNetwork;
                      }
                    });
                  },
                )
              : const SizedBox(width: 48),
          IconButton(
            icon: const Icon(Icons.close, color: Color(0xFF9CA3AF)),
            onPressed: _handleClose,
          ),
        ],
      ),
    );
  }

  Widget _buildStepTitleAndSubtitle({required String title, String? subtitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 8),
        _buildRichText(
          title,
          baseStyle: const TextStyle(
            color: Color(0xFF1C315C),
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 8),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFF6B7280), fontSize: 14),
          ),
        ],
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildProcessingStep() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 20),
        _DotsLoader(),
        const SizedBox(height: 24),
        _buildRichText(
          I18n.t.modal.titles.processing,
          baseStyle: const TextStyle(
            color: Color(0xFF1C315C),
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF041C4C),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(children: [
            _buildRichText(
              I18n.t.modal.info.noReloadPageTitle,
              textAlign: TextAlign.center,
              baseStyle: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16),
            ),
            const SizedBox(height: 4),
            Text(
              I18n.t.modal.info.noReloadPageSubTitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.normal,
                  fontSize: 14),
            ),
          ]),
        ),
        const SizedBox(height: 24),
        _buildInfoField(
          label:
              "${I18n.t.modal.labels.amountSent} (${_selectedAsset?.symbol})",
          value: amountFormatter(
            _qrData?.amount,
            symbol: _selectedAsset?.symbol,
            locale: widget.locale,
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildCurrentStep() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());

    switch (_currentStep) {
      case ModalStep.selectAsset:
        return Column(
          children: [
            _buildStepTitleAndSubtitle(
              title: I18n.t.modal.titles.selectAsset,
              subtitle: I18n.t.modal.subTitles.selectAsset,
            ),
            Expanded(child: _buildAssetList()),
            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 24),
              child: Text(
                I18n.t.modal.info.selectNetworkLater,
                style: const TextStyle(
                  color: Color(0xFF1C315C),
                  fontSize: 16,
                  fontWeight: FontWeight.normal,
                ),
              ),
            ),
          ],
        );
      case ModalStep.selectNetwork:
        return Column(
          children: [
            _buildStepTitleAndSubtitle(
              title: I18n.t.modal.titles.selectNetwork,
              subtitle: I18n.t.modal.subTitles.selectNetwork,
            ),
            Expanded(child: _buildNetworkList()),
          ],
        );
      case ModalStep.showQr:
        return Column(
          children: [
            _buildStepTitleAndSubtitle(
              title: I18n.interpolate(
                I18n.t.modal.titles.scanQr,
                {'symbol': _selectedAsset?.symbol ?? ''},
              ),
              subtitle:
                  widget.productTitle.isNotEmpty ? widget.productTitle : null,
            ),
            Expanded(child: _buildQrView()),
          ],
        );
      case ModalStep.processing:
        return _buildProcessingStep();
      case ModalStep.result:
        return _buildResult();
    }
  }

  Widget _buildAssetList() {
    return CustomScrollbar(
      controller: scrollControllerAssets,
      child: ListView.builder(
        controller: scrollControllerAssets,
        padding: const EdgeInsets.only(bottom: 24),
        itemCount: _assets.length,
        itemBuilder: (context, index) {
          final asset = _assets[index];
          return _buildSelectionCard(
            title: asset.symbol,
            subtitle: asset.name,
            imageUrl: asset.image,
            onTap: () {
              setState(() {
                _selectedAsset = asset;
                _currentStep = ModalStep.selectNetwork;
              });
            },
          );
        },
      ),
    );
  }

  Widget _buildSelectionCard({
    required String title,
    required String subtitle,
    required String imageUrl,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFF3F4F6)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      width: 40,
                      height: 40,
                      filterQuality: FilterQuality.high,
                      errorBuilder: (ctx, _, __) => const Icon(
                          Icons.monetization_on,
                          size: 40,
                          color: Color(0xFF1C315C)),
                    )
                  : Image.memory(
                      base64Decode(logoApolo),
                      width: 40,
                      height: 40,
                      filterQuality: FilterQuality.high,
                    ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: Color(0xFF1C315C),
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (subtitle.isNotEmpty)
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: Color(0xFF6B7280),
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNetworkList() {
    final networks = _selectedAsset?.networks ?? [];
    return CustomScrollbar(
      controller: scrollControllerNetworks,
      child: ListView.builder(
        controller: scrollControllerNetworks,
        padding: const EdgeInsets.only(bottom: 24),
        itemCount: networks.length,
        itemBuilder: (context, index) {
          final network = networks[index];
          return _buildSelectionCard(
            title: network.name,
            subtitle: '',
            imageUrl: network.network == 'apolopay'
                ? ''
                : network.image, // Temporary, will handle apolopay logo
            onTap: () => handleSelectNetwork(network),
          );
        },
      ),
    );
  }

  Widget _buildQrView() {
    if (_qrData == null) {
      return Center(
        child: Text(I18n.t.modal.titles.error,
            style: const TextStyle(color: Color(0xFF1C315C))),
      );
    }

    final partialPaymentResponseData = _finalResult
            is ClientResponse<PartialPaymentResponseData>
        ? (_finalResult as ClientResponse<PartialPaymentResponseData>).result
        : null;

    final String symbol = _selectedAsset?.symbol ?? '';

    final double currentAmountPaid =
        (partialPaymentResponseData?.amountPaid ?? _qrData?.amountPaid ?? 0)
            .toDouble();
    final double remainingAmount =
        (partialPaymentResponseData?.amount ?? _qrData?.amount ?? 0).toDouble();
    final double remainingAmountForPay = remainingAmount - currentAmountPaid;

    final warningToken =
        I18n.interpolate(I18n.t.modal.warnings.onlyToken, {'symbol': symbol});

    final int diffMs =
        _qrData!.expiresAtMs - DateTime.now().millisecondsSinceEpoch;
    final int minutesLeft = (diffMs / (1000 * 60)).ceil();
    final String timeWindow = '${minutesLeft > 0 ? minutesLeft : 0} min';

    final warningTimer =
        I18n.interpolate(I18n.t.modal.warnings.timer, {'time': timeWindow});

    final bool isApoloPay = _selectedNetwork?.network == 'apolopay';

    // Widget auxiliar para las filas de balance
    Widget buildBalanceRow(String label, String value,
        {required bool isHighlight}) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Color(0xFF6B7280), fontSize: 13),
          ),
          Text(
            value,
            style: TextStyle(
              color: isHighlight
                  ? const Color(0xFFEA580C)
                  : const Color(0xFF1C315C),
              fontWeight: FontWeight.bold,
              fontSize: isHighlight ? 14 : 13,
            ),
          ),
        ],
      );
    }

    return CustomScrollbar(
      controller: scrollControllerQr,
      child: SingleChildScrollView(
        controller: scrollControllerQr,
        child: Column(children: [
          StreamBuilder<String>(
            stream: _timerController.stream,
            initialData: '-- min : -- seg',
            builder: (context, snapshot) {
              return Text(
                snapshot.data!,
                style: const TextStyle(
                  color: Color(0xFFEA580C),
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  letterSpacing: 1.0,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              );
            },
          ),

          // --- BALANCE CARD (PAGO PARCIAL) ---
          if (currentAmountPaid > 0) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF7ED), // Fondo naranja muy suave
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFEA580C).withValues(alpha: 0.5),
                  width: 1,
                ),
              ),
              child: Column(children: [
                buildBalanceRow(
                  "${I18n.t.modal.labels.paid}:",
                  amountFormatter(
                    currentAmountPaid,
                    symbol: symbol,
                    locale: widget.locale,
                  ),
                  isHighlight: false,
                ),
                const SizedBox(height: 4),
                buildBalanceRow(
                  "${I18n.t.modal.labels.remainingToPay}:",
                  amountFormatter(
                    remainingAmount,
                    symbol: symbol,
                    locale: widget.locale,
                  ),
                  isHighlight: true,
                ),
              ]),
            ),
          ],

          const SizedBox(height: 16),
          Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    QrImageView(data: _qrData!.address, size: 180),
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.all(4),
                      child: isApoloPay
                          ? Image.memory(base64Decode(logoApolo),
                              filterQuality: FilterQuality.high)
                          : (_selectedNetwork?.image != null
                              ? Image.network(_selectedNetwork!.image,
                                  filterQuality: FilterQuality.high)
                              : const Icon(Icons.qr_code,
                                  color: Color(0xFF1C315C))),
                    ),
                  ],
                ),
              ),
              Positioned(
                bottom: -12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    amountFormatter(
                      remainingAmountForPay,
                      symbol: symbol,
                      locale: widget.locale,
                    ),
                    style: const TextStyle(
                        color: Color(0xFFEA580C),
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF041C4C),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(children: [
              _buildRichText(
                I18n.t.modal.info.noReloadPageTitle,
                textAlign: TextAlign.center,
                baseStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16),
              ),
              const SizedBox(height: 4),
              Text(
                I18n.t.modal.info.noReloadPageSubTitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.normal,
                    fontSize: 14),
              ),
            ]),
          ),
          SizedBox(height: isApoloPay ? 12 : 24),
          if (!isApoloPay) ...[
            _buildInfoField(
                label: I18n.t.modal.labels.network,
                value: _selectedNetwork?.name ?? ''),
            _buildInfoField(
                label: I18n.t.modal.labels.address,
                value: _qrData!.address,
                hasCopy: true),
            const SizedBox(height: 12),
          ],
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!isApoloPay) ...[
                _buildWarningItem(I18n.t.modal.warnings.networkMatch),
                _buildWarningItem(I18n.t.modal.warnings.noNFT),
                _buildWarningItem(warningToken),
              ],
              const SizedBox(height: 12),
              _buildRichText(warningTimer,
                  baseStyle:
                      const TextStyle(color: Color(0xFF1C315C), fontSize: 12)),
            ],
          ),
          const SizedBox(height: 24),
          if (isApoloPay)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF041C4C),
                borderRadius: BorderRadius.circular(12),
              ),
              child: _buildRichText(
                I18n.t.modal.actions.scanApp,
                textAlign: TextAlign.center,
                baseStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.normal,
                    fontSize: 14),
              ),
            ),
          if (_qrData?.paymentUrl != null) ...[
            const SizedBox(height: 16),
            _buildPayFromDeviceButton(),
          ],
        ]),
      ),
    );
  }

  Widget _buildPayFromDeviceButton() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _handlePayFromDevice,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFEA580C),
          foregroundColor: Colors.white,
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 24),
        ),
        child: Text(I18n.t.modal.actions.payFromDevice),
      ),
    );
  }

  Widget _buildWarningItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 6),
            child: CircleAvatar(radius: 2, backgroundColor: Color(0xFF1C315C)),
          ),
          const SizedBox(width: 8),
          Expanded(
              child: _buildRichText(text,
                  baseStyle:
                      const TextStyle(color: Color(0xFF1C315C), fontSize: 12))),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final bool isSuccess = _finalResult is ClientResponse;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isSuccess)
          const Icon(Icons.check_circle_outline,
              color: Color(0xFF22C55E), size: 80)
        else
          const Icon(Icons.error_outline, color: Colors.red, size: 80),
        const SizedBox(height: 24),
        _buildRichText(
          isSuccess ? I18n.t.modal.titles.success : I18n.t.modal.titles.error,
          baseStyle: const TextStyle(
              color: Color(0xFF1C315C),
              fontSize: 24,
              fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),
        _buildRichText(
          isSuccess
              ? '${I18n.t.modal.success.message} ${I18n.t.modal.success.message2}'
              : (_finalResult?.message ?? I18n.t.errors.generic),
          textAlign: TextAlign.center,
          baseStyle: const TextStyle(color: Color(0xFF1C315C), fontSize: 15),
        ),
        if (isSuccess) ...[
          const SizedBox(height: 32),
          Text(
            I18n.t.modal.success.details,
            style: const TextStyle(
              color: Color(0xFF1C315C),
              fontSize: 16,
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline,
            ),
          ),
          const SizedBox(height: 24),
          if (widget.productTitle.isNotEmpty)
            _buildInfoField(
                label: I18n.t.modal.labels.product, value: widget.productTitle),
          _buildInfoField(
            label: I18n.t.modal.labels.amount,
            value: amountFormatter(
              _qrData?.amount,
              symbol: _selectedAsset?.symbol,
              locale: widget.locale,
            ),
          ),
        ],
        const SizedBox(height: 32),
        if (!isSuccess)
          SizedBox(
            width: 350,
            child: ElevatedButton(
              onPressed: _handleClose,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                foregroundColor: Colors.white,
                shape: const StadiumBorder(),
                padding: const EdgeInsets.symmetric(horizontal: 24),
              ),
              child: Text(I18n.t.modal.actions.close),
            ),
          ),
      ],
    );
  }

  Widget _buildInfoField(
      {required String label, required String value, bool hasCopy = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF526282)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    value,
                    style:
                        const TextStyle(color: Color(0xFF4B5563), fontSize: 14),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (hasCopy)
                  Material(
                    color: const Color(0xFF526282),
                    borderRadius: BorderRadius.circular(8),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(8),
                      onTap: () async {
                        if (_isCopied) return;
                        await Clipboard.setData(ClipboardData(text: value));
                        if (mounted) {
                          setState(() => _isCopied = true);
                        }
                        Future.delayed(const Duration(seconds: 2), () {
                          if (mounted) setState(() => _isCopied = false);
                        });
                      },
                      child: Container(
                        constraints: const BoxConstraints(minWidth: 70),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        alignment: Alignment.center,
                        child: Text(
                          _isCopied
                              ? I18n.t.modal.actions.copied
                              : I18n.t.modal.actions.copy,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          Positioned(
            top: -10,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              color: Colors.white,
              child: Text(
                label,
                style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DotsLoader extends StatefulWidget {
  @override
  State<_DotsLoader> createState() => _DotsLoaderState();
}

class _DotsLoaderState extends State<_DotsLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1500))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        // Tamaños: 12, 16, 20, 16, 12 como en la imagen
        final baseSizes = [12.0, 16.0, 20.0, 16.0, 12.0];

        return AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            // Creamos un desfase basado en el índice
            final delay = index * 0.15;
            final progress = (_controller.value - delay).clamp(0.0, 1.0);
            final double scale = 0.8 +
                (0.4 *
                    Curves.easeInOut.transform(
                        (1.0 - (progress - 0.5).abs() * 2).clamp(0.0, 1.0)));

            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: baseSizes[index] * scale,
              height: baseSizes.reduce(max),
              decoration: const BoxDecoration(
                color: Color(0xFFEA580C),
                shape: BoxShape.circle,
              ),
            );
          },
        );
      }),
    );
  }
}
