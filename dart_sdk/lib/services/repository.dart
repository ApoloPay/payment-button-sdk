import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:apolopay_sdk/models/client_response.dart';
import 'package:apolopay_sdk/models/asset.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';

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
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$apiUrl/payment-button/process/confirm'),
        headers: getHeaders(publicKey),
        body: jsonEncode({
          'processId': processId,
          'assetId': assetId,
          'networkId': networkId,
        }),
      );
      final data = jsonDecode(response.body);

      if (data['result'] == null) {
        throw ClientError.fromError(
          data,
          code: data['status'] ?? 'qr_fetch_error',
          message: data['message'] ?? 'Error al obtener el código QR',
        );
      }

      final Map<String, dynamic> result =
          Map<String, dynamic>.from(data['result']);
      final wallet = result['wallet'];
      final networkName = result['network'];

      final String address = networkName == "apolopay"
          ? "https://p2p.apolopay.app/payment/$processId"
          : wallet;

      return ClientResponse.fromJson(
        data,
        result: (val) {
          final Map<String, dynamic> map = Map<String, dynamic>.from(val);
          return QrResponseData.fromJson({
            ...map,
            'address': address,
            'qrCodeUrl':
                'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=$address&ecc=H',
            'paymentUrl': address.startsWith('http') ? address : null,
          });
        },
      );
    } catch (error) {
      throw ClientError.fromError(
        error,
        code: 'qr_error',
        message: 'Error al obtener el QR',
      );
    }
  }
}
