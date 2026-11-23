import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Future<void> pumpButton(WidgetTester tester, SmartPayClient client) async {
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: SmartPayButton(client: client, processId: 'proc-1'),
      ),
    ));
  }

  group('SmartPayButton config validation', () {
    testWidgets('accepts a sandbox key regardless of its length',
        (tester) async {
      await pumpButton(
        tester,
        SmartPayClient(publicKey: 'pk_test_c6649e69315edc3389a3cc439e7b0649'),
      );

      expect(find.text('Config Error'), findsNothing);
    });

    testWidgets('accepts a valid 35-char live key', (tester) async {
      await pumpButton(
        tester,
        SmartPayClient(publicKey: 'pk_${'a' * 32}'),
      );

      expect(find.text('Config Error'), findsNothing);
    });

    testWidgets('rejects a live key with the wrong length', (tester) async {
      await pumpButton(
        tester,
        SmartPayClient(publicKey: 'pk_too_short'),
      );

      expect(find.text('Config Error'), findsOneWidget);
    });
  });
}
