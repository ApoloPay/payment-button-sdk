import 'package:apolopay_sdk/apolopay_sdk.dart';

enum ClientCode {
  success('success'),
  paymentSuccess('payment_success'),
  paymentFailed('payment_failed'),
  paymentPartial('payment_partial'),
  paymentTimeout('payment_timeout'),
  connectError('connect_error'),
  socketConnectionError('socket_connection_error'),
  dataLoadError('data_load_error'),
  qrFetchError('qr_fetch_error'),
  paymentProcessNotAvailable('payment_process_not_available'),
  getAssetsError('get_assets_error'),
  unknownError('unknown_error');

  const ClientCode(this.value);
  final String value;
}

abstract class ClientResponseBase {
  ClientResponseBase({required this.code, required this.message});

  final ClientCode code;
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
        code: ClientCode.values.firstWhere(
          (code) => code.value == (json['status'] ?? code),
          orElse: () => ClientCode.success,
        ),
        message: json['message'] ?? message ?? I18n.t.successes.success,
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
    ClientCode? code,
    String? message,
  }) {
    if (error is ClientError) return error;

    if (error is Map) {
      return ClientError(
        code: code ??
            ClientCode.values.firstWhere(
              (code) => code.value == (error['statusCode'] ?? error['status']),
              orElse: () => ClientCode.unknownError,
            ),
        message: message ??
            error['message']?.toString() ??
            I18n.t.errors.unknownError,
        error: error['error'] ?? error,
      );
    }
    return ClientError(
      code: code ?? ClientCode.unknownError,
      message: error?.toString() ?? message ?? I18n.t.errors.unknownError,
      error: error,
    );
  }
}
