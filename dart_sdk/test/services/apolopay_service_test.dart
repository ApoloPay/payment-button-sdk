import 'package:apolopay_sdk/models/apolopay_models.dart';
import 'package:apolopay_sdk/services/apolo_pay_client.dart';
import 'package:apolopay_sdk/services/apolopay_service.dart';
import 'package:apolopay_sdk/services/sandbox_data.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ApoloPayService (sandbox)', () {
    // These tests never call getAssets() first, so the internal asset cache
    // stays empty and fetchQrCodeDetails() must fall back to
    // SandboxData.fallbackAssets — the same offline path used when the real
    // catalog can't be reached. This keeps the test isolated from the network.
    late ApoloPayService service;

    setUp(() {
      service = ApoloPayService(ApoloPayOptions(
        client: ApoloPayClient(publicKey: 'pk_test_unit_12345'),
        processId: 'proc-unit-test',
      ));
    });

    test('fetchQrCodeDetails never touches the real backend or socket', () async {
      final asset = SandboxData.fallbackAssets.first;
      final network = asset.networks.firstWhere((n) => n.isApoloPay);

      final qrData = await service.fetchQrCodeDetails(
        assetId: asset.id,
        networkId: network.id,
      );

      // Matches SandboxData.buildQrData's fixed mock shape — if this ever
      // drifted to the real Repository/SocketService path, either the values
      // below would be wrong or the test would hang/fail on a real network call.
      expect(qrData.address, 'sandbox-process-proc-unit-test');
      expect(qrData.amount, 103.75);
      expect(qrData.amountPaid, 0);
    });

    test('fetchQrCodeDetails falls back to the first asset/network for unknown ids',
        () async {
      final qrData = await service.fetchQrCodeDetails(
        assetId: 'does-not-exist',
        networkId: 'does-not-exist-either',
      );

      final fallbackAsset = SandboxData.fallbackAssets.first;
      final fallbackNetwork = fallbackAsset.networks.first;

      expect(qrData.asset, fallbackAsset.symbol);
      expect(qrData.network, fallbackNetwork.network);
    });

    test('disconnectWebSocket is a no-op when nothing was ever connected', () {
      expect(() => service.disconnectWebSocket(), returnsNormally);
    });
  });

  group('ApoloPayClient.isSandbox', () {
    test('is true only for pk_test_ prefixed keys', () {
      expect(ApoloPayClient(publicKey: 'pk_test_abc').isSandbox, isTrue);
      expect(ApoloPayClient(publicKey: 'pk_live_abc').isSandbox, isFalse);
    });
  });
}
