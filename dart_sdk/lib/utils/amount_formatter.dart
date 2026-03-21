import 'package:apolopay_sdk/apolopay_sdk.dart';
import 'package:intl/intl.dart';

String amountFormatter(
  dynamic amount, {
  String? symbol,
  int decimals = 8,
  I18nLocale? locale,
}) {
  final language = {
    I18nLocale.es: 'es_ES',
    I18nLocale.en: 'en_US',
  }[locale ?? I18nLocale.es];

  if (amount == null || amount == "") {
    amount = 0;
  }

  double amountNumber = double.tryParse(amount.toString()) ?? 0.0;

  // Truncar decimales sin redondear
  final sign = amountNumber < 0 ? "-" : "";
  final absAmount = amountNumber.abs();

  // Usar toString() para obtener la representación literal preferida de Dart
  // y manejar notación científica si es necesario.
  String absAmountStr = absAmount.toString();
  if (absAmountStr.contains('e')) {
    // Si es notación científica, usamos toStringAsFixed pero con un límite alto
    absAmountStr =
        absAmount.toStringAsFixed(20).replaceAll(RegExp(r'\.?0+$'), "");
  }

  final parts = absAmountStr.split('.');
  String truncatedStr = parts[0];

  if (parts.length > 1 && decimals > 0) {
    String decimalPart = parts[1];
    if (decimalPart.length > decimals) {
      decimalPart = decimalPart.substring(0, decimals);
    }
    truncatedStr = "$truncatedStr.$decimalPart";
  }

  final finalAmount = double.parse("$sign$truncatedStr");

  final formatter = NumberFormat.decimalPattern(language);
  formatter.maximumFractionDigits = decimals;
  formatter.minimumFractionDigits = 0;

  final formattedNumber = formatter.format(finalAmount);

  return symbol != null ? "$formattedNumber $symbol" : formattedNumber;
}
