import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_modal.dart';

// When the catalog can't be loaded (timeout, host down), the first step says
// so and offers a retry, instead of an empty list with no way out.
void main() {
  testWidgets('a catalog that failed to load shows the error and a retry',
      (tester) async {
    var online = false;
    final client = MockClient((request) async {
      if (!online) throw http.ClientException('offline', request.url);
      return http.Response(
        jsonEncode({
          'result': [
            {
              'id': 'usdt',
              'name': 'Tether USD',
              'symbol': 'USDT',
              'image': '',
              'networks': [
                {
                  'id': 'usdt-eth',
                  'name': 'Ethereum',
                  'network': 'ethereum',
                  'image': '',
                  'isNative': false,
                },
              ],
            },
          ],
        }),
        200,
      );
    });

    await http.runWithClient(() async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: SmartPayModal(
            options: SmartPayOptions(
              // A live key: no sandbox fallback catalog.
              client: SmartPayClient(
                publicKey: 'pk_live_00000000000000000000000000',
              ),
              processId: 'proc-1',
            ),
          ),
        ),
      ));
      await tester.pump();
      await tester.pump();

      expect(find.text('No se pudo cargar los datos de pago.'), findsOneWidget);
      expect(find.text('Reintentar'), findsOneWidget);

      online = true;
      await tester.tap(find.text('Reintentar'));
      await tester.pump();
      await tester.pump();

      expect(find.text('Reintentar'), findsNothing);
      expect(find.text('USDT'), findsOneWidget);
    }, () => client);
  });
}
