import 'package:apolopay_sdk/utils/variables.dart';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../models/client_response.dart';
import '../models/apolopay_models.dart';

class _SocketResponse<T> {
  final bool success;
  final String event;
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
        return options.onError(ClientError.fromError(response.toJson()));
      }

      final result = response.result as Map<String, dynamic>;
      if (result['status'] == 'completed') {
        options.onSuccess(ClientResponse(
          code: 'payment_success',
          message: response.message,
          result: QrResponseData.fromJson(result),
        ));
      }
    });

    _socket!.onConnectError((error) {
      options.onError(ClientError.fromError(
        error,
        code: 'SOCKET_CONNECTION_ERROR',
        message: 'Error de conexión en tiempo real.',
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
