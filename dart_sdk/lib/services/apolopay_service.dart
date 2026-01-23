import 'package:apolopay_sdk/models/asset.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';

import 'repository.dart';
import 'socket_service.dart';

class ApoloPayService {
  final ApoloPayOptions options;
  late final SocketService _socketService;

  ApoloPayService(this.options) {
    _socketService = SocketService(options);
  }

  Future<List<Asset>> getAssets() async {
    final response = await Repository.getAssets();
    return response.result!;
  }

  Future<QrResponseData> fetchQrCodeDetails({
    required String assetId,
    required String networkId,
  }) async {
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
