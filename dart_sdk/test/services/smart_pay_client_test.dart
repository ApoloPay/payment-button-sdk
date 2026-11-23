import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart';
import 'package:nexora_smartpay_sdk/services/repository.dart';
import 'package:nexora_smartpay_sdk/services/socket_service.dart';

void main() {
  group('SmartPayClient base URLs', () {
    test('defaults to the Nexora SmartPay hosts', () {
      final client = SmartPayClient(publicKey: 'pk_test_abc');
      expect(client.apiUrl, defaultApiUrl);
      expect(client.getApiUrl(), 'https://api.smartpaylatam.com');
      expect(client.socketUrl, defaultSocketUrl);
      expect(client.getSocketUrl(), 'https://ws.smartpaylatam.com');
    });

    test('accepts overrides, including the legacy Apolo hosts', () {
      final client = SmartPayClient(
        publicKey: 'pk_test_abc',
        apiUrl: legacyApoloApiUrl,
        socketUrl: legacyApoloSocketUrl,
      );
      expect(client.apiUrl, 'https://pb-api.apolopay.app');
      expect(client.socketUrl, 'https://pb-ws.apolopay.app');
    });

    test('trims trailing slashes', () {
      final client = SmartPayClient(
        publicKey: 'pk_test_abc',
        apiUrl: 'https://sandbox-api.smartpaylatam.com/v1//',
        socketUrl: 'https://sandbox-ws.smartpaylatam.com/',
      );
      expect(client.apiUrl, 'https://sandbox-api.smartpaylatam.com/v1');
      expect(client.socketUrl, 'https://sandbox-ws.smartpaylatam.com');
    });

    test('accepts every Nexora subdomain and the legacy Apolo hosts', () {
      for (final url in [
        'https://smartpaylatam.com',
        'https://sandbox.smartpaylatam.com',
        'https://API.SmartPayLatam.com',
      ]) {
        expect(
            SmartPayClient(publicKey: 'pk_test_abc', apiUrl: url).apiUrl, url);
      }
      final legacy = SmartPayClient(
        publicKey: 'pk_test_abc',
        apiUrl: legacyApoloApiUrl,
        socketUrl: legacyApoloSocketUrl,
      );
      expect(legacy.apiUrl, legacyApoloApiUrl);
    });

    test('allows plain http only for localhost / 127.0.0.1', () {
      final client = SmartPayClient(
        publicKey: 'pk_test_abc',
        apiUrl: 'http://localhost:3000',
        socketUrl: 'http://127.0.0.1:4000/',
      );
      expect(client.apiUrl, 'http://localhost:3000');
      expect(client.socketUrl, 'http://127.0.0.1:4000');
    });

    for (final invalid in [
      'http://sandbox-api.smartpaylatam.com',
      'not a url',
      '',
      'ftp://sandbox-api.smartpaylatam.com',
      'ws://sandbox-ws.smartpaylatam.com',
      // Only Nexora's own hosts: no lookalikes, no other servers.
      'https://api.example.com',
      'https://api.smartpaylatam.com.evil.com',
      'https://evilsmartpaylatam.com',
      'https://api.smartpaylatam.com@evil.com',
      'https://p2p.apolopay.app',
    ]) {
      test('rejects invalid URL "$invalid" at construction', () {
        expect(
          () => SmartPayClient(publicKey: 'pk_test_abc', apiUrl: invalid),
          throwsA(isA<ArgumentError>().having((e) => e.name, 'name', 'apiUrl')),
        );
        expect(
          () => SmartPayClient(publicKey: 'pk_test_abc', socketUrl: invalid),
          throwsA(
              isA<ArgumentError>().having((e) => e.name, 'name', 'socketUrl')),
        );
      });
    }
  });

  group('Repository / SocketService use the client URLs', () {
    late List<Uri> requested;
    late MockClient mockHttp;

    setUp(() {
      requested = [];
      mockHttp = MockClient((request) async {
        requested.add(request.url);
        final body = request.url.path.endsWith('/assets')
            ? {'status': 'success', 'message': 'ok', 'result': []}
            : {
                'status': 'success',
                'message': 'ok',
                'result': {
                  'id': 'q1',
                  'wallet': '0xabc',
                  'network': 'tron',
                  'asset': 'USDT',
                  'amount': 1,
                },
              };
        return http.Response(jsonEncode(body), 200);
      });
    });

    test('Repository hits the given base URL', () async {
      await http.runWithClient(() async {
        await Repository.getAssets('https://sandbox-api.smartpaylatam.com');
        await Repository.fetchQrCodeDetails(
          apiUrl: 'https://sandbox-api.smartpaylatam.com',
          publicKey: 'pk_live',
          processId: 'proc-1',
          assetId: 'a1',
          networkId: 'n1',
        );
      }, () => mockHttp);

      expect(requested.map((u) => u.toString()), [
        'https://sandbox-api.smartpaylatam.com/payment-button/assets',
        'https://sandbox-api.smartpaylatam.com/payment-button/process/confirm',
      ]);
    });

    test('SmartPayService passes the client apiUrl through', () async {
      await http.runWithClient(() async {
        await SmartPayService(SmartPayOptions(
          client: SmartPayClient(publicKey: 'pk_test_x'),
          processId: 'p1',
        )).getAssets();
        await SmartPayService(SmartPayOptions(
          client: SmartPayClient(
            publicKey: 'pk_test_x',
            apiUrl: 'https://testing.smartpaylatam.com/',
          ),
          processId: 'p1',
        )).getAssets();
      }, () => mockHttp);

      expect(requested.map((u) => u.toString()), [
        'https://api.smartpaylatam.com/payment-button/assets',
        'https://testing.smartpaylatam.com/payment-button/assets',
      ]);
    });

    test('SocketService connects to the client socketUrl', () {
      final byDefault = SocketService(SmartPayOptions(
        client: SmartPayClient(publicKey: 'pk_test_x'),
        processId: 'p1',
      ));
      final overridden = SocketService(SmartPayOptions(
        client: SmartPayClient(
          publicKey: 'pk_test_x',
          socketUrl: 'https://sandbox-ws.smartpaylatam.com/',
        ),
        processId: 'p1',
      ));

      expect(byDefault.url, defaultSocketUrl);
      expect(overridden.url, 'https://sandbox-ws.smartpaylatam.com');
    });
  });
}
