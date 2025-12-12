import 'package:flutter/material.dart';
import 'package:payment_button_sdk/payment_button_sdk.dart';
// 1. Importa tu SDK

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Ejemplo de SDK de Pago'),
        ),
        body: Center(
          // 2. Usa tu Widget
          child: PaymentButtonWidget(
            publicKey: 'pk_test_FLUTTER_123',
            amount: 150.50,

            // 3. Define los callbacks
            onSuccess: (PaymentResponse response) {
              print('Pago exitoso: ${response.transactionId}');
              // (Muestra un SnackBar, navega a otra pantalla, etc.)
            },
            onError: (PaymentError error) {
              print('Error en pago: ${error.message}');
            },

            // 4. Define el contenido del botón
            child: const Text(
              'Pagar 150.50 USD',
              style: TextStyle(fontSize: 16),
            ),
          ),
        ),
      ),
    );
  }
}
