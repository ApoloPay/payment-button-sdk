abstract class ClientResponseBase {
  ClientResponseBase({required this.code, required this.message});

  final String code;
  final String message;
}

class ClientResponse<T extends dynamic> extends ClientResponseBase {
  final T? result;

  ClientResponse({
    required super.code,
    required super.message,
    this.result,
  });

  factory ClientResponse.fromJson(
    Map<String, dynamic> json, {
    String? code,
    String? message,
    T Function(dynamic)? result,
  }) =>
      ClientResponse(
        code: json['status'] ?? code ?? 'success',
        message: json['message'] ?? message ?? 'Success',
        result: result?.call(json['result']) ?? json['result'] ?? json,
      );
}

class ClientError extends ClientResponseBase {
  final dynamic error;

  ClientError({
    required super.code,
    required super.message,
    this.error,
  });

  factory ClientError.fromError(
    dynamic error, {
    String? code,
    String? message,
  }) =>
      ClientError(
        code: error['statusCode'] ?? code ?? 'unknown_error',
        message: error['message'] ?? message ?? 'Error desconocido',
        error: error['error'] ?? error,
      );
}
