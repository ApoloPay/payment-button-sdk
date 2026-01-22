import 'dart:async';
import 'package:flutter/material.dart';
import 'package:payment_button_sdk/i18n/i18n.dart';
import 'package:payment_button_sdk/models/client_response.dart';
import 'package:payment_button_sdk/models/asset.dart';
import 'package:payment_button_sdk/models/network.dart';
import 'package:payment_button_sdk/models/payment_client_models.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:convert';
import 'package:payment_button_sdk/assets/logo_apolo.dart';
import '../services/payment_service.dart';

enum ModalStep { selectAsset, selectNetwork, showQr, result }

class PaymentModal extends StatefulWidget {
  final PaymentOptions options;
  final String? productTitle;

  const PaymentModal({
    super.key,
    required this.options,
    this.productTitle,
  });

  static Future<void> show(BuildContext context, PaymentOptions options,
      {String? productTitle}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          PaymentModal(options: options, productTitle: productTitle),
    );
  }

  @override
  State<PaymentModal> createState() => _PaymentModalState();
}

class _PaymentModalState extends State<PaymentModal>
    with SingleTickerProviderStateMixin {
  late PaymentService _service;
  ModalStep _currentStep = ModalStep.selectAsset;
  bool _isLoading = true;
  List<Asset> _assets = [];
  Asset? _selectedAsset;
  Network? _selectedNetwork;
  QrResponseData? _qrData;
  ClientResponseBase? _finalResult;
  String _timerString = '00:00';
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _service = PaymentService(PaymentOptions(
      client: widget.options.client,
      processId: widget.options.processId,
      onSuccess: (res) {
        setState(() {
          _finalResult = res;
          _currentStep = ModalStep.result;
        });
        widget.options.onSuccess(res);
      },
      onError: (err) {
        setState(() {
          _finalResult = err;
          _currentStep = ModalStep.result;
        });
        widget.options.onError(err);
      },
    ));
    _loadAssets();
  }

  Future<void> _loadAssets() async {
    try {
      final assets = await _service.getAssets();
      setState(() {
        _assets = assets;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      // Handle error
    }
  }

  void _startTimer(int expiresAtMs) {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final now = DateTime.now().millisecondsSinceEpoch;
      final distance = expiresAtMs - now;

      if (distance <= 0) {
        timer.cancel();
        setState(() => _timerString = '00:00');
        return;
      }

      final minutes = (distance ~/ 60000).toString().padLeft(2, '0');
      final seconds = ((distance % 60000) ~/ 1000).toString().padLeft(2, '0');
      setState(() => _timerString = '$minutes:$seconds');
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _service.disconnectWebSocket();
    super.dispose();
  }

  Widget _buildRichText(String text,
      {TextStyle? baseStyle, TextAlign textAlign = TextAlign.start}) {
    final List<TextSpan> spans = [];
    final RegExp regExp = RegExp(
        r'(<span class="highlight">.*?</span>|<strong>.*?</strong>|<br>|[^<]+)');
    final Iterable<Match> matches = regExp.allMatches(text);

    for (final match in matches) {
      final String part = match.group(0)!;
      if (part.startsWith('<span class="highlight">')) {
        spans.add(TextSpan(
          text: part
              .replaceAll('<span class="highlight">', '')
              .replaceAll('</span>', ''),
          style: const TextStyle(
              color: Color(0xFFEA580C), fontWeight: FontWeight.bold),
        ));
      } else if (part.startsWith('<strong>')) {
        spans.add(TextSpan(
          text: part.replaceAll('<strong>', '').replaceAll('</strong>', ''),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ));
      } else if (part == '<br>') {
        spans.add(const TextSpan(text: '\n'));
      } else {
        spans.add(TextSpan(text: part));
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
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Color(0xFFF6F2EC),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
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
        ],
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
            onPressed: () => Navigator.pop(context),
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
        const SizedBox(height: 24),
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
              title: I18n.t['modal']['titles']['selectAsset'],
              subtitle: I18n.t['modal']['subtitles']['selectAsset'],
            ),
            Expanded(child: _buildAssetList()),
          ],
        );
      case ModalStep.selectNetwork:
        return Column(
          children: [
            _buildStepTitleAndSubtitle(
              title: I18n.t['modal']['titles']['selectNetwork'],
              subtitle: I18n.t['modal']['subtitles']['selectNetwork'],
            ),
            Expanded(child: _buildNetworkList()),
          ],
        );
      case ModalStep.showQr:
        return Column(
          children: [
            _buildStepTitleAndSubtitle(
              title: I18n.interpolate(
                I18n.t['modal']['titles']['scanQr'],
                {'symbol': _selectedAsset?.symbol ?? ''},
              ),
            ),
            Expanded(child: _buildQrView()),
          ],
        );
      case ModalStep.result:
        return _buildResult();
    }
  }

  Widget _buildAssetList() {
    return ListView.builder(
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
    return ListView.builder(
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
          onTap: () async {
            setState(() => _isLoading = true);
            try {
              final qrData = await _service.fetchQrCodeDetails(
                assetId: _selectedAsset!.id,
                networkId: network.id,
              );
              setState(() {
                _qrData = qrData;
                _selectedNetwork = network;
                _currentStep = ModalStep.showQr;
                _isLoading = false;
              });
              _startTimer(qrData.expiresAtMs);
            } catch (e) {
              setState(() => _isLoading = false);
            }
          },
        );
      },
    );
  }

  Widget _buildQrView() {
    if (_qrData == null) {
      return Center(
          child: Text(I18n.t['modal']['titles']['error'],
              style: const TextStyle(color: Color(0xFF1C315C))));
    }

    final String symbol = _selectedAsset?.symbol ?? '';
    final warningToken = I18n.interpolate(
        I18n.t['modal']['warnings']['onlyToken'], {'symbol': symbol});
    final warningTimer = I18n.interpolate(
        I18n.t['modal']['warnings']['timer'], {'time': '30 min'});

    return SingleChildScrollView(
      child: Column(
        children: [
          Text(
            _timerString,
            style: const TextStyle(
                color: Color(0xFFEA580C),
                fontWeight: FontWeight.w600,
                fontSize: 14),
          ),
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
                      color: Colors.black.withOpacity(0.05),
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
                      child: _selectedNetwork?.network == 'apolopay'
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
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    '${_qrData?.amount ?? ''} $symbol',
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
          _buildInfoField(
              label: I18n.t['modal']['labels']['network'],
              value: _selectedNetwork?.name ?? ''),
          _buildInfoField(
              label: I18n.t['modal']['labels']['address'],
              value: _qrData!.address,
              hasCopy: true),
          const SizedBox(height: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildWarningItem(I18n.t['modal']['warnings']['networkMatch']),
              _buildWarningItem(I18n.t['modal']['warnings']['noNFT']),
              _buildWarningItem(warningToken),
              const SizedBox(height: 12),
              _buildRichText(warningTimer,
                  baseStyle:
                      const TextStyle(color: Color(0xFF1C315C), fontSize: 12)),
            ],
          ),
          const SizedBox(height: 24),
          if (_selectedNetwork?.network == 'apolopay')
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF041C4C),
                borderRadius: BorderRadius.circular(12),
              ),
              child: _buildRichText(
                I18n.t['modal']['actions']['scanApp'],
                textAlign: TextAlign.center,
                baseStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14),
              ),
            ),
        ],
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
          isSuccess
              ? I18n.t['modal']['titles']['success']
              : I18n.t['modal']['titles']['error'],
          baseStyle: const TextStyle(
              color: Color(0xFF1C315C),
              fontSize: 24,
              fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),
        _buildRichText(
          isSuccess
              ? '${I18n.t['modal']['success']['message']} ${I18n.t['modal']['success']['message2']}'
              : (_finalResult?.message ?? I18n.t['errors']['generic']),
          textAlign: TextAlign.center,
          baseStyle: const TextStyle(color: Color(0xFF1C315C), fontSize: 15),
        ),
        if (isSuccess) ...[
          const SizedBox(height: 32),
          Text(
            I18n.t['modal']['success']['details'],
            style: const TextStyle(
              color: Color(0xFF1C315C),
              fontSize: 16,
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline,
            ),
          ),
          const SizedBox(height: 24),
          _buildInfoField(
              label: I18n.t['modal']['labels']['amount'],
              value:
                  '${_qrData?.amount ?? ""} ${_selectedAsset?.symbol ?? ""}'),
        ],
        const SizedBox(height: 32),
        if (!isSuccess)
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                foregroundColor: Colors.white,
                shape: const StadiumBorder(),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(I18n.t['modal']['actions']['close']),
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
                  GestureDetector(
                    onTap: () {
                      // Copy logic
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF526282),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        I18n.t['modal']['actions']['copy'],
                        style:
                            const TextStyle(color: Colors.white, fontSize: 12),
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
