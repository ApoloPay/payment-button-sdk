import 'package:apolopay_sdk/models/asset.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';

import 'repository.dart';
import 'sandbox_data.dart';
import 'socket_service.dart';

class ApoloPayService {
  final ApoloPayOptions options;
  late final SocketService _socketService;
  List<Asset> _assets = [];

  ApoloPayService(this.options) {
    _socketService = SocketService(options);
  }

  Future<List<Asset>> getAssets() async {
    if (options.client.isSandbox) {
      // The catalog endpoint is public and holds no payment/wallet data, so we
      // still fetch it in sandbox mode just to reuse its real asset/network icons.
      try {
        final response = await Repository.getAssets();
        _assets = response.result!;
      } catch (_) {
        _assets = SandboxData.fallbackAssets;
      }
      return _assets;
    }

    final response = await Repository.getAssets();
    _assets = response.result!;
    return _assets;
  }

  Future<QrResponseData> fetchQrCodeDetails({
    required String assetId,
    required String networkId,
  }) async {
    if (options.client.isSandbox) {
      final assets = _assets.isNotEmpty ? _assets : SandboxData.fallbackAssets;
      final asset = assets.firstWhere(
        (a) => a.id == assetId,
        orElse: () => assets.first,
      );
      final network = asset.networks.firstWhere(
        (n) => n.id == networkId,
        orElse: () => asset.networks.first,
      );

      return SandboxData.buildQrData(
        processId: options.processId,
        asset: asset,
        network: network,
      );
    }

    final qrData = await Repository.fetchQrCodeDetails(
      publicKey: options.client.getPublicKey(),
      processId: options.processId,
      assetId: assetId,
      networkId: networkId,
    );

    _socketService.connect(qrData.result!.id);

    return qrData.result!;
  }

  void disconnectWebSocket() {
    _socketService.disconnect();
  }
}
