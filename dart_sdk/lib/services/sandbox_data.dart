import 'package:apolopay_sdk/models/asset.dart';
import 'package:apolopay_sdk/models/network.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';

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
          id: 'sandbox-apolopay',
          name: 'Apolo Pay',
          network: Network.apolopayNetworkId,
          image: '',
          isNative: true,
        ),
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
      qrCodeUrl:
          'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=$address&ecc=H',
      expiresAtMs: now + 10 * 60 * 1000,
      paymentUrl: null,
    );
  }
}
