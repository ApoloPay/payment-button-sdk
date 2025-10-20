// Modelo para la respuesta exitosa (similar a tu interface PaymentResponse)
class PaymentResponse {
  final String transactionId;
  final String status;

  PaymentResponse({required this.transactionId, required this.status});

  // Constructor 'factory' para crear una instancia desde un JSON
  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      transactionId: json['transactionId'] as String,
      status: json['status'] as String,
    );
  }
}

// Modelo para la respuesta de error (similar a tu interface PaymentError)
class PaymentError {
  final String code;
  final String message;

  PaymentError({required this.code, required this.message});

  // Constructor 'factory' para crear una instancia desde un JSON
  factory PaymentError.fromJson(Map<String, dynamic> json) {
    return PaymentError(
      code: json['code'] as String,
      message: json['message'] as String,
    );
  }
}