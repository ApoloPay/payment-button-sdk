import 'package:flutter/material.dart';
import 'client.dart';
import 'models.dart';

// Define el estado del botón
enum ButtonStatus { idle, loading }

class PaymentButtonWidget extends StatefulWidget {
  // 1. Props (Inputs)
  final String publicKey;
  final double amount;
  final Widget child; // Para que el usuario ponga su propio texto/icono

  // 2. Eventos (Outputs)
  final OnSuccessCallback onSuccess;
  final OnErrorCallback onError;

  const PaymentButtonWidget({
    Key? key,
    required this.publicKey,
    required this.amount,
    required this.onSuccess,
    required this.onError,
    required this.child,
  }) : super(key: key);

  @override
  State<PaymentButtonWidget> createState() => _PaymentButtonWidgetState();
}

class _PaymentButtonWidgetState extends State<PaymentButtonWidget> {
  // 3. Estado interno
  ButtonStatus _status = ButtonStatus.idle;

  void _pay() {
    // Inicia el cliente
    final client = PaymentClient(
      publicKey: widget.publicKey,
      amount: widget.amount,
      onSuccess: (response) {
        if (mounted) {
          setState(() => _status = ButtonStatus.idle);
        }
        widget.onSuccess(response); // Dispara el evento al padre
      },
      onError: (error) {
        if (mounted) {
          setState(() => _status = ButtonStatus.idle);
        }
        widget.onError(error); // Dispara el evento al padre
      },
    );

    // Actualiza el estado a 'loading' y llama al cliente
    setState(() => _status = ButtonStatus.loading);
    client.initiatePayment();
  }

  @override
  Widget build(BuildContext context) {
    final bool isLoading = _status == ButtonStatus.loading;

    // Usamos ElevatedButton como base, pero puedes usar el que quieras
    return ElevatedButton(
      // Llama a _pay solo si no está cargando
      onPressed: isLoading ? null : _pay, 

      // Estilo visual cuando está deshabilitado
      style: ElevatedButton.styleFrom(
        disabledBackgroundColor: Colors.grey,
      ),

      child: isLoading
          ? const SizedBox( // Muestra un spinner cuando carga
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
          : widget.child, // Muestra el contenido del usuario
    );
  }
}