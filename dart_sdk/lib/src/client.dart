import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

// Define los tipos de callbacks para que el Widget los use
typedef OnSuccessCallback = void Function(PaymentResponse response);
typedef OnErrorCallback = void Function(PaymentError error);

class PaymentClient {
  final String apiKey;
  final double amount;
  final String currency;
  final OnSuccessCallback onSuccess;
  final OnErrorCallback onError;

  PaymentClient({
    required this.apiKey,
    required this.amount,
    required this.currency,
    required this.onSuccess,
    required this.onError,
  });

  Future<void> initiatePayment() async {
    // Simulación de llamada a tu backend
    try {
      // const response = await http.post(
      //   Uri.parse('https://api.tuplataforma.com/pay'),
      //   headers: {
      //     'Authorization': 'Bearer $apiKey',
      //     'Content-Type': 'application/json',
      //   },
      //   body: jsonEncode({
      //     'amount': amount,
      //     'currency': currency,
      //   }),
      // );

      // Simulación exitosa (reemplaza con la llamada real)
      await Future.delayed(const Duration(seconds: 1));

      // Simula una respuesta JSON (reemplaza con jsonDecode(response.body))
      final mockResponseJson = {
        'transactionId': 'txn_12345abc_flutter',
        'status': 'success',
      };

      // (Descomenta esto cuando tengas la llamada real)
      // if (response.statusCode == 200) {
      //   onSuccess(PaymentResponse.fromJson(jsonDecode(response.body)));
      // } else {
      //   onError(PaymentError.fromJson(jsonDecode(response.body)));
      // }

      // Código de simulación:
      onSuccess(PaymentResponse.fromJson(mockResponseJson));
    } catch (e) {
      // Simulación de error
      final mockError = PaymentError(
        code: 'FLUTTER_API_ERROR',
        message: e.toString(),
      );
      onError(mockError);
    }
  }
}
