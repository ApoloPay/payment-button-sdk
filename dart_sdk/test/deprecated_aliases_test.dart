// ignore_for_file: deprecated_member_use_from_same_package
import 'package:flutter_test/flutter_test.dart';
import 'package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart';

void main() {
  test('pre-2.0 ApoloPay* names still resolve to the SmartPay* types', () {
    final ApoloPayClient legacyClient =
        ApoloPayClient(publicKey: 'pk_test_alias');
    expect(legacyClient, isA<SmartPayClient>());
    expect(legacyClient.isSandbox, isTrue);

    final ApoloPayOptions options =
        ApoloPayOptions(client: legacyClient, processId: 'proc-1');
    expect(options, isA<SmartPayOptions>());

    expect(ApoloPayService(options), isA<SmartPayService>());
    expect(ApoloPayButton(client: legacyClient), isA<SmartPayButton>());
  });
}
