import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:payment_button_sdk/models/client_response.dart';
import 'package:payment_button_sdk/models/asset.dart';
import 'package:payment_button_sdk/models/payment_client_models.dart';

class Repository {
  static const String apiUrl = "https://pb-test-api.apolopay.app";

  static Map<String, String> getHeaders(String? publicKey) {
    final headers = {'Content-Type': 'application/json'};

    if (publicKey != null) {
      headers['x-public-key'] = publicKey;
    }

    return headers;
  }

  static Future<ClientResponse<List<Asset>>> getAssets() async {
    try {
      final response = await http.get(
            Uri.parse('$apiUrl/payment-button/assets'),
            headers: getHeaders(null),
          ),
          data = jsonDecode(response.body);

      return ClientResponse.fromJson(
        data,
        result: (json) => Asset.listFrom(json),
      );
    } catch (error) {
      throw ClientError.fromError(
        error,
        code: 'assets_error',
        message: 'Error al obtener los assets',
      );
    }
  }

  static Future<ClientResponse<QrResponseData>> fetchQrCodeDetails({
    required String publicKey,
    required String processId,
    required String assetId,
    required String networkId,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$apiUrl/payment-button/process/confirm'),
        headers: getHeaders(publicKey),
        body: jsonEncode({
          'processId': processId,
          'assetId': assetId,
          'networkId': networkId,
          'metadata': metadata != null ? jsonEncode(metadata) : null,
        }),
      );

      final data = jsonDecode(response.body),
          result = data['result'],
          wallet = result['wallet'],
          network = result['network'];

      final String address = network == "apolopay"
          ? "https://p2p.apolopay.app/payment/$wallet"
          : wallet;

      return ClientResponse.fromJson({
        ...result,
        'address': address,
        'qrCodeUrl':
            'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=$address&ecc=H',
        'expiresAtMs': result['expiresAtMs'] ??
            (DateTime.now().millisecondsSinceEpoch + 30 * 60 * 1000),
      }, result: (json) => QrResponseData.fromJson(json));
    } catch (error) {
      throw ClientError.fromError(
        error,
        code: 'qr_error',
        message: 'Error al obtener el QR',
      );
    }
  }
}
