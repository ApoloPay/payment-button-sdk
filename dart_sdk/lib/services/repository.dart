import 'dart:async';
import 'dart:convert';
import 'package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart';
import 'package:nexora_smartpay_sdk/utils/variables.dart';
import 'package:http/http.dart' as http;
import 'package:nexora_smartpay_sdk/models/client_response.dart';
import 'package:nexora_smartpay_sdk/models/asset.dart';
import 'package:nexora_smartpay_sdk/models/network.dart';

/// Max time to wait for a REST request before giving up. Without it, an
/// unreachable host (DNS failure, server down) leaves the button stuck in
/// "loading" for as long as the platform's own network timeout (20+ s).
const Duration requestTimeout = Duration(seconds: 10);

class Repository {
  static Map<String, String> getHeaders(String? publicKey) {
    final headers = {'Content-Type': 'application/json'};

    if (publicKey != null) {
      headers['x-public-key'] = publicKey;
    }

    return headers;
  }

  /// [apiUrl] is the REST API base URL (from [SmartPayClient.apiUrl]),
  /// without a trailing slash.
  static Future<ClientResponse<List<Asset>>> getAssets(String apiUrl) async {
    try {
      final response = await http
              .get(
                Uri.parse('$apiUrl/payment-button/assets'),
                headers: getHeaders(null),
              )
              .timeout(requestTimeout),
          data = jsonDecode(response.body);

      return ClientResponse.fromJson(
        data,
        result: (json) => Asset.listFrom(json),
      );
    } catch (error) {
      throw ClientError.fromError(
        error,
        code: ClientCode.getAssetsError,
        message: I18n.t.errors.getAssetsError,
      );
    }
  }

  /// [apiUrl] is the REST API base URL (from [SmartPayClient.apiUrl]),
  /// without a trailing slash.
  static Future<ClientResponse<QrResponseData>> fetchQrCodeDetails({
    required String apiUrl,
    required String publicKey,
    required String processId,
    required String assetId,
    required String networkId,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$apiUrl/payment-button/process/confirm'),
            headers: getHeaders(publicKey),
            body: jsonEncode({
              'processId': processId,
              'assetId': assetId,
              'networkId': networkId,
            }),
          )
          .timeout(requestTimeout);
      final data = jsonDecode(response.body);

      if (data['result'] == null) {
        throw ClientError(
          code: ClientCode.paymentProcessNotAvailable,
          message: I18n.t.errors.paymentProcessNotAvailable,
        );
      }

      final Map<String, dynamic> result =
          Map<String, dynamic>.from(data['result']);
      final wallet = result['wallet'];
      final networkName = result['network'];

      final String address = networkName == Network.apolopayNetworkId
          ? "$appURL/payment-process/$processId"
          : wallet;

      return ClientResponse.fromJson(
        data,
        result: (val) {
          final Map<String, dynamic> map = Map<String, dynamic>.from(val);
          return QrResponseData.fromJson({
            ...map,
            'address': address,
            'qrCodeUrl': generateQrCodeDataUri(address),
            'paymentUrl': address.startsWith('http') ? address : null,
          });
        },
      );
    } catch (error) {
      throw ClientError.fromError(
        error,
        code: ClientCode.qrFetchError,
        message: I18n.t.errors.qrFetchError,
      );
    }
  }
}
