import 'package:apolopay_sdk/models/network.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Network', () {
    test('isApoloPay is true only for the apolopay network id', () {
      final apolopay = Network(
        id: '1',
        name: 'Apolo Pay',
        network: 'apolopay',
        image: '',
        isNative: true,
      );
      final near = Network(
        id: '2',
        name: 'NEAR',
        network: 'near',
        image: '',
        isNative: false,
      );

      expect(apolopay.isApoloPay, isTrue);
      expect(near.isApoloPay, isFalse);
      expect(Network.apolopayNetworkId, 'apolopay');
    });

    test('toJson/fromJson round-trips all fields', () {
      final network = Network(
        id: 'net-1',
        name: 'Ethereum',
        network: 'ethereum',
        image: 'https://example.com/eth.png',
        isNative: false,
      );

      final restored = Network.fromJson(network.toJson());

      expect(restored.id, network.id);
      expect(restored.name, network.name);
      expect(restored.network, network.network);
      expect(restored.image, network.image);
      expect(restored.isNative, network.isNative);
    });

    test('copyWith overrides only the given fields', () {
      final network = Network(
        id: 'net-1',
        name: 'NEAR',
        network: 'near',
        image: '',
        isNative: false,
      );

      final copy = network.copyWith(name: 'NEAR Protocol');

      expect(copy.id, network.id);
      expect(copy.name, 'NEAR Protocol');
      expect(copy.network, network.network);
    });
  });
}
