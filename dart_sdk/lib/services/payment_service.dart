import 'package:payment_button_sdk/models/asset.dart';
import 'package:payment_button_sdk/models/payment_client_models.dart';

import 'repository.dart';
import 'socket_service.dart';

class PaymentService {
  final PaymentOptions options;
  late final SocketService _socketService;

  PaymentService(this.options) {
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
