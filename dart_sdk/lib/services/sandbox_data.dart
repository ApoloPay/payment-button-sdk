import 'package:nexora_smartpay_sdk/models/asset.dart';
import 'package:nexora_smartpay_sdk/models/network.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/utils/qr_code.dart';

class SandboxData {
  // Only used when the real asset catalog can't be fetched (e.g. offline demo).
  static final List<Asset> fallbackAssets = [
    Asset(
      id: 'sandbox-usdt',
      name: 'Tether USD',
      symbol: 'USDT',
      image: '',
      networks: [
        Network(
          id: 'sandbox-near',
          name: 'NEAR',
          network: 'near',
          image: '',
          isNative: false,
        ),
        Network(
          id: 'sandbox-ethereum',
          name: 'Ethereum',
          network: 'ethereum',
          image: '',
          isNative: false,
        ),
      ],
    ),
  ];

  static QrResponseData buildQrData({
    required String processId,
    required Asset asset,
    required Network network,
  }) {
    final now = DateTime.now().millisecondsSinceEpoch;
    final address = network.isApoloPay
        ? 'sandbox-process-$processId'
        : 'sandbox-${network.network}-0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d';

    return QrResponseData(
      id: processId,
      network: network.network,
      asset: asset.symbol,
      amount: 103.75,
      amountPaid: 0,
      address: address,
      qrCodeUrl: generateQrCodeDataUri(address),
      expiresAtMs: now + 10 * 60 * 1000,
      paymentUrl: null,
    );
  }
}
