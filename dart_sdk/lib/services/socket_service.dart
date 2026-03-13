import 'package:apolopay_sdk/apolopay_sdk.dart';
import 'package:apolopay_sdk/utils/variables.dart';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../models/client_response.dart';

enum SocketEvents {
  fundsReceived('funds_received'),
  partialPayment('partial_payment');

  const SocketEvents(this.value);
  final String value;
}

class _SocketResponse<T> {
  final bool success;
  final SocketEvents event;
  final String message;
  final T result;

  _SocketResponse({
    required this.success,
    required this.event,
    required this.message,
    required this.result,
  });

  Map<String, dynamic> toJson() => {
        'success': success,
        'event': event,
        'message': message,
        'result': result,
      };

  factory _SocketResponse.fromJson(Map<String, dynamic> json) {
    return _SocketResponse(
      success: json['success'],
      event: json['event'],
      message: json['message'],
      result: json['result'],
    );
  }
}

class SocketService {
  SocketService(this.options);
  final ApoloPayOptions options;
  io.Socket? _socket;

  void connect(String processId) {
    if (_socket != null && _socket!.connected) return;

    _socket = io.io(
      socketURL,
      io.OptionBuilder().setTransports(['polling']).setExtraHeaders(
          {'x-public-key': options.client.getPublicKey()}).build(),
    );

    _socket!.onConnect((_) {
      debugPrint('Socket.io Conectado.');
      _socket!.emit('process:connect', {'processId': processId});
    });

    _socket!.on('process:message', (data) {
      final response = _SocketResponse.fromJson(data);

      if (!response.success) {
        return options.onError?.call(ClientError.fromError(response.toJson()));
      }

      if (response.event == SocketEvents.partialPayment) {
        return options.onPartialPayment?.call(ClientResponse(
          code: ClientCode.paymentPartial,
          message: response.message,
          result: PartialPaymentResponseData.fromJson(response.result),
        ));
      }

      if (response.event == SocketEvents.fundsReceived) {
        return options.onSuccess?.call(ClientResponse(
          code: ClientCode.paymentSuccess,
          message: response.message,
          result: QrResponseData.fromJson(response.result),
        ));
      }
    });

    _socket!.onConnectError((error) {
      options.onError?.call(ClientError.fromError(
        error,
        code: ClientCode.socketConnectionError,
        message: I18n.t.errors.socketConnectionError,
      ));
      disconnect();
    });

    _socket!.onDisconnect((reason) {
      debugPrint('Socket.io Desconectado: $reason');
      _socket = null;
    });
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
    }
  }
}
