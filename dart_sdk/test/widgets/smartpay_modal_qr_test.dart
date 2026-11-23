import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:nexora_smartpay_sdk/i18n/i18n.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_modal.dart';
import 'package:qr_flutter/qr_flutter.dart';

void main() {
  testWidgets(
      'sandbox QR step renders the QR locally (QrImageView, ECC H), '
      'no network request', (tester) async {
    final requests = <Uri>[];

    await http.runWithClient(
      () => tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: SmartPayModal(
            options: SmartPayOptions(
              client: SmartPayClient(publicKey: 'pk_test_unit_12345'),
              processId: 'proc-1',
            ),
          ),
        ),
      )),
      // Offline: the catalog request fails, so the sandbox falls back to its
      // local catalog. Any request is recorded to prove no QR service is hit.
      () => MockClient((request) async {
        requests.add(request.url);
        throw http.ClientException('offline', request.url);
      }),
    );
    await tester.pump();
    await tester.pump();

    await tester.tap(find.text('USDT'));
    await tester.pump();

    await tester.tap(find.text('NEAR'));
    await tester.pumpAndSettle();
    // Network disclaimer.
    await tester.tap(find.text(I18n.t.modal.actions.understood));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    final qrView = tester.widget<QrImageView>(find.byType(QrImageView));
    expect(qrView.errorCorrectionLevel, QrErrorCorrectLevel.H);

    // Nothing in the tree is loaded over the network (the offline sandbox
    // catalog has no images), and the only request made was the catalog one.
    final networkImages = tester
        .widgetList<Image>(find.byType(Image))
        .map((i) => i.image)
        .whereType<NetworkImage>();
    expect(networkImages, isEmpty);
    expect(
      requests.every((u) => u.path == '/payment-button/assets'),
      isTrue,
      reason: 'unexpected requests: $requests',
    );

    // Close the modal's periodic countdown before the test ends.
    await tester.pumpWidget(const SizedBox());
  });
}
