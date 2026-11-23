import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nexora_smartpay_sdk/models/client_response.dart';
import 'package:nexora_smartpay_sdk/services/repository.dart';
import 'package:nexora_smartpay_sdk/services/sandbox_data.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/services/smartpay_service.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/utils/qr_code.dart';

/// A client whose requests never answer (unreachable host / DNS hang).
http.Client hangingClient() =>
    MockClient((_) => Completer<http.Response>().future);

void main() {
  group('Repository request timeout', () {
    testWidgets('getAssets gives up after requestTimeout with getAssetsError',
        (tester) async {
      Object? error;
      http.runWithClient(
        () => Repository.getAssets('https://unreachable.example.com')
            .then<void>((_) {}, onError: (Object e) => error = e),
        hangingClient,
      );

      await tester.pump(requestTimeout - const Duration(milliseconds: 1));
      expect(error, isNull);

      await tester.pump(const Duration(milliseconds: 1));
      expect(
        error,
        isA<ClientError>()
            .having((e) => e.code, 'code', ClientCode.getAssetsError),
      );
    });

    testWidgets(
        'fetchQrCodeDetails gives up after requestTimeout with qrFetchError',
        (tester) async {
      Object? error;
      http.runWithClient(
        () => Repository.fetchQrCodeDetails(
          apiUrl: 'https://unreachable.example.com',
          publicKey: 'pk_live',
          processId: 'proc-1',
          assetId: 'a1',
          networkId: 'n1',
        ).then<void>((_) {}, onError: (Object e) => error = e),
        hangingClient,
      );

      await tester.pump(requestTimeout);
      expect(
        error,
        isA<ClientError>()
            .having((e) => e.code, 'code', ClientCode.qrFetchError),
      );
    });

    testWidgets('sandbox getAssets falls back as soon as the timeout fires',
        (tester) async {
      final service = SmartPayService(SmartPayOptions(
        client: SmartPayClient(publicKey: 'pk_test_unit_12345'),
        processId: 'proc-1',
      ));

      Object? result;
      http.runWithClient(
        () => service.getAssets().then<void>((assets) => result = assets),
        hangingClient,
      );

      await tester.pump(requestTimeout);
      expect(result, same(SandboxData.fallbackAssets));
    });
  });

  group('Repository QR code', () {
    test('fetchQrCodeDetails builds the QR locally from the wallet address',
        () async {
      final requests = <Uri>[];
      final response = await http.runWithClient(
        () => Repository.fetchQrCodeDetails(
          apiUrl: 'https://api.example.com',
          publicKey: 'pk_live',
          processId: 'proc-1',
          assetId: 'a1',
          networkId: 'n1',
        ),
        () => MockClient((request) async {
          requests.add(request.url);
          return http.Response(
            '{"status":"success","message":"ok","result":'
            '{"id":"q1","wallet":"0xabc","network":"tron","asset":"USDT","amount":1}}',
            200,
          );
        }),
      );

      expect(response.result!.address, '0xabc');
      expect(response.result!.qrCodeUrl, generateQrCodeDataUri('0xabc'));
      expect(response.result!.qrCodeUrl, startsWith('data:image/svg+xml'));
      // Only the backend was contacted.
      expect(requests.map((u) => u.host), ['api.example.com']);
    });
  });

  group('generateQrCodeDataUri', () {
    test('returns a local SVG data URI, deterministic per input', () {
      final uri = generateQrCodeDataUri('0x1a2b3c4d5e6f');

      expect(uri, startsWith('data:image/svg+xml'));
      expect(Uri.decodeComponent(uri), contains('<svg'));
      expect(generateQrCodeDataUri('a'), generateQrCodeDataUri('a'));
      expect(generateQrCodeDataUri('a'), isNot(generateQrCodeDataUri('b')));
    });
  });
}
