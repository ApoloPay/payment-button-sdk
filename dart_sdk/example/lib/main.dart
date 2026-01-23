import 'package:flutter/material.dart';
import 'package:apolopay_sdk/apolopay_sdk.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Apolo Pay SDK Example'),
        ),
        body: Center(
          child: ApoloPayButton(
            client: ApoloPayClient(publicKey: 'publicKey'),
            processId: 'processId',
            onSuccess: (response) {
              print('Pago exitoso: ${response.message}');
            },
            onError: (error) {
              print('Error en pago: ${error.message}');
            },
          ),
        ),
      ),
    );
  }
}
