import 'package:nexora_smartpay_sdk/models/asset.dart';
import 'package:nexora_smartpay_sdk/models/network.dart';
import 'package:nexora_smartpay_sdk/services/sandbox_data.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('SandboxData.fallbackAssets', () {
    test('exposes one asset with near + ethereum networks, never apolopay', () {
      expect(SandboxData.fallbackAssets, hasLength(1));

      final asset = SandboxData.fallbackAssets.first;
      expect(asset.symbol, 'USDT');
      expect(asset.networks.map((n) => n.network), ['near', 'ethereum']);
      expect(asset.networks.where((n) => n.isApoloPay), isEmpty);
    });
  });

  group('withoutApoloPayNetworks', () {
    final apolo = Network(
      id: 'n-apolo',
      name: 'Apolo Pay',
      network: 'APOLOPAY',
      image: '',
      isNative: true,
    );
    final eth = Network(
      id: 'n-eth',
      name: 'Ethereum',
      network: 'ethereum',
      image: '',
      isNative: false,
    );

    test('drops the apolopay network, and an asset left without networks', () {
      final result = withoutApoloPayNetworks([
        Asset(
            id: 'usdt',
            name: 'Tether',
            symbol: 'USDT',
            image: '',
            networks: [apolo, eth]),
        Asset(
            id: 'apl',
            name: 'Solo Apolo',
            symbol: 'APL',
            image: '',
            networks: [apolo]),
      ]);

      expect(result.map((a) => a.id), ['usdt']);
      expect(result.single.networks.map((n) => n.id), ['n-eth']);
    });
  });

  group('SandboxData.buildQrData', () {
    final asset = SandboxData.fallbackAssets.first;

    test('builds a process-scoped address for the apolopay network', () {
      // Never offered anymore (filtered out), but the builder still handles it.
      final apolopayNetwork = Network(
        id: 'sandbox-apolopay',
        name: 'Apolo Pay',
        network: Network.apolopayNetworkId,
        image: '',
        isNative: true,
      );

      final qr = SandboxData.buildQrData(
        processId: 'proc-123',
        asset: asset,
        network: apolopayNetwork,
      );

      expect(qr.address, 'sandbox-process-proc-123');
      expect(qr.qrCodeUrl, contains(qr.address));
      expect(qr.network, 'apolopay');
      expect(qr.asset, 'USDT');
      expect(qr.amount, 103.75);
      expect(qr.amountPaid, 0);
      expect(qr.paymentUrl, isNull);
    });

    test('builds a network-scoped fake wallet address for external networks',
        () {
      final near = asset.networks.firstWhere((n) => n.network == 'near');

      final qr = SandboxData.buildQrData(
        processId: 'proc-123',
        asset: asset,
        network: near,
      );

      expect(qr.address, startsWith('sandbox-near-0x'));
      expect(qr.network, 'near');
    });

    test('sets an expiry roughly 10 minutes in the future', () {
      final network = asset.networks.first;
      final before = DateTime.now().millisecondsSinceEpoch;

      final qr = SandboxData.buildQrData(
        processId: 'proc-123',
        asset: asset,
        network: network,
      );

      final expectedMin = before + 10 * 60 * 1000 - 1000;
      final expectedMax = before + 10 * 60 * 1000 + 1000;
      expect(qr.expiresAtMs, inInclusiveRange(expectedMin, expectedMax));
    });
  });
}
