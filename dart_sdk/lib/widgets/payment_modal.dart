import 'dart:async';
import 'package:flutter/material.dart';
import 'package:payment_button_sdk/i18n/i18n.dart';
import 'package:payment_button_sdk/models/client_response.dart';
import 'package:payment_button_sdk/models/asset.dart';
import 'package:payment_button_sdk/models/network.dart';
import 'package:payment_button_sdk/models/payment_client_models.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../services/payment_client.dart';

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
  late PaymentClient _client;
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
    _client = PaymentClient(PaymentOptions(
      publicKey: widget.options.publicKey,
      amount: widget.options.amount,
      metadata: widget.options.metadata,
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
      final assets = await _client.getAssets();
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
    _client.disconnectWebSocket();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Color(0xFF1E1E1E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _buildCurrentStep(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.white12)),
      ),
      child: Row(
        children: [
          if (_currentStep != ModalStep.selectAsset &&
              _currentStep != ModalStep.result)
            IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () {
                setState(() {
                  if (_currentStep == ModalStep.selectNetwork)
                    _currentStep = ModalStep.selectAsset;
                  if (_currentStep == ModalStep.showQr)
                    _currentStep = ModalStep.selectNetwork;
                });
              },
            ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.productTitle ?? 'Apolo Pay',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold),
                ),
                Text(
                  I18n.interpolate(
                    '${I18n.t['modal']['labels']['amount']}: {amount}',
                    {'amount': widget.options.amount.toStringAsFixed(2)},
                  ),
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: I18n.t['modal']['actions']['close'],
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildStepTitleAndSubtitle({required String title, String? subtitle}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ],
      ),
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
      itemCount: _assets.length,
      itemBuilder: (context, index) {
        final asset = _assets[index];
        return ListTile(
          // leading: asset.iconUrl != null
          //     ? CachedNetworkImage(
          //         imageUrl: asset.iconUrl!, width: 40, height: 40)
          //     : const Icon(Icons.currency_bitcoin, color: Colors.white),
          title: Text(asset.name, style: const TextStyle(color: Colors.white)),
          subtitle:
              Text(asset.symbol, style: const TextStyle(color: Colors.white70)),
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

  Widget _buildNetworkList() {
    final networks = _selectedAsset?.networks ?? [];
    return ListView.builder(
      itemCount: networks.length,
      itemBuilder: (context, index) {
        final network = networks[index];
        return ListTile(
          leading: const Icon(Icons.lan, color: Colors.white),
          title:
              Text(network.name, style: const TextStyle(color: Colors.white)),
          onTap: () async {
            setState(() => _isLoading = true);
            try {
              final qrData = await _client.fetchQrCodeDetails(
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
    if (_qrData == null)
      return Center(
          child: Text(I18n.t['modal']['titles']['error'],
              style: const TextStyle(color: Colors.white)));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: QrImageView(data: _qrData!.address, size: 200),
          ),
          const SizedBox(height: 24),
          Text(
            _timerString,
            style: const TextStyle(
                color: Colors.orange,
                fontSize: 32,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Text(
              I18n.interpolate(
                I18n.t['modal']['warnings']['timer'],
                {'time': _timerString},
              ),
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white70, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final bool isSuccess = _finalResult is ClientResponse;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          isSuccess ? Icons.check_circle : Icons.error,
          color: isSuccess ? Colors.green : Colors.red,
          size: 80,
        ),
        const SizedBox(height: 16),
        Text(
          isSuccess
              ? I18n.t['modal']['titles']['success']
              : I18n.t['modal']['titles']['error'],
          style: const TextStyle(
              color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Text(_finalResult?.message ?? '',
            style: const TextStyle(color: Colors.white70)),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: () => Navigator.pop(context),
          child: Text(I18n.t['modal']['actions']['close']),
        ),
      ],
    );
  }
}
