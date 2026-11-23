// Pre-2.0 (`apolopay_sdk`) public names, kept so existing integrations keep
// compiling after the rename to Nexora SmartPay. They will be removed in a
// future major version.
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'package:nexora_smartpay_sdk/services/smartpay_service.dart';
import 'package:nexora_smartpay_sdk/widgets/smartpay_button.dart';

@Deprecated('Use SmartPayClient')
typedef ApoloPayClient = SmartPayClient;

@Deprecated('Use SmartPayOptions')
typedef ApoloPayOptions = SmartPayOptions;

@Deprecated('Use SmartPayService')
typedef ApoloPayService = SmartPayService;

@Deprecated('Use SmartPayButton')
typedef ApoloPayButton = SmartPayButton;
