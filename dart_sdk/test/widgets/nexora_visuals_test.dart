import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nexora_smartpay_sdk/assets/nexora_mark.dart';
import 'package:nexora_smartpay_sdk/i18n/i18n.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/utils/nexora_style.dart';
import 'package:nexora_smartpay_sdk/widgets/info_modal.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_button.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_modal.dart';

// Smoke tests for the Nexora visual identity: the button, the disclaimer
// modal and the payment modal render without exceptions, and nothing of the
// old Apolo branding (label, PNG logo) is left on the trigger.
void main() {
  const processId = '123e4567-e89b-12d3-a456-426614174000';

  testWidgets('SmartPayButton defaults to the Nexora label and mark',
      (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: Center(
          child: SmartPayButton(
            client: SmartPayClient(publicKey: 'pk_test_unit_visuals'),
            processId: processId,
          ),
        ),
      ),
    ));

    expect(find.text('Nexora'), findsOneWidget);
    expect(find.text('Apolo Pay'), findsNothing);
    expect(find.byType(NexoraMark), findsOneWidget);
    expect(find.byType(Image), findsNothing);
    expect(
      tester.widget<Material>(find.descendant(
          of: find.byType(SmartPayButton), matching: find.byType(Material))),
      isA<Material>().having((m) => m.color, 'color', NexoraStyle.black),
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('SmartPayButton config error renders without the mark',
      (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: SmartPayButton(
          client: SmartPayClient(publicKey: 'pk_too_short'),
          processId: processId,
        ),
      ),
    ));

    expect(find.text('Config Error'), findsOneWidget);
    expect(find.byType(NexoraMark), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('InfoModal shows the Nexora disclaimer', (tester) async {
    I18n.setLocale(I18nLocale.es);
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: Builder(
          builder: (context) => TextButton(
            onPressed: () => InfoModal.show(
              context,
              title: I18n.t.modal.info.disclaimerTitle,
              subtitle: I18n.t.modal.info.disclaimerSubtitle,
            ),
            child: const Text('open'),
          ),
        ),
      ),
    ));

    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();

    expect(find.textContaining('Nexora'), findsWidgets);
    expect(find.textContaining('Apolo'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('SmartPayModal (sandbox) renders the asset and network steps',
      (tester) async {
    tester.view.physicalSize = const Size(1200, 1600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await tester.runAsync(() async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: SmartPayModal(
            options: SmartPayOptions(
              client: SmartPayClient(publicKey: 'pk_test_unit_visuals'),
              processId: processId,
            ),
          ),
        ),
      ));
      // The sandbox catalog fetch fails under flutter_test (no network) and
      // falls back to SandboxData.fallbackAssets.
      for (var i = 0; i < 50; i++) {
        await Future<void>.delayed(const Duration(milliseconds: 100));
        await tester.pump();
        if (find.byType(CircularProgressIndicator).evaluate().isEmpty) break;
      }
    });

    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('USDT'), findsWidgets);
    expect(tester.takeException(), isNull);

    await tester.tap(find.text('USDT').first);
    await tester.pumpAndSettle();

    // The apolopay network has no image in the sandbox data, so its card
    // falls back to the Nexora mark instead of a network icon.
    expect(find.byType(NexoraMark), findsWidgets);
    expect(tester.takeException(), isNull);
  });
}
