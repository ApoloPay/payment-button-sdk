import 'package:apolopay_sdk/models/client_response.dart';
import 'package:apolopay_sdk/services/apolo_pay_client.dart';

class QrRequestDetails {
  final String assetId;
  final String networkId;

  QrRequestDetails({
    required this.assetId,
    required this.networkId,
  });

  Map<String, dynamic> toJson() => {
        'assetId': assetId,
        'networkId': networkId,
      };

  factory QrRequestDetails.fromJson(Map<String, dynamic> json) =>
      QrRequestDetails(
        assetId: json['assetId'],
        networkId: json['networkId'],
      );
}

// Lo que esperamos recibir para mostrar el QR
class QrResponseData {
  final String id;
  final String network;
  final String asset;
  final num amount;
  final String address;
  final String qrCodeUrl;
  final int expiresAtMs;
  final String? paymentUrl;

  QrResponseData({
    required this.id,
    required this.network,
    required this.asset,
    required this.amount,
    required this.address,
    required this.qrCodeUrl,
    required this.expiresAtMs,
    this.paymentUrl,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'network': network,
        'asset': asset,
        'amount': amount,
        'address': address,
        'qrCodeUrl': qrCodeUrl,
        'expiresAtMs': expiresAtMs,
        'paymentUrl': paymentUrl,
      };

  factory QrResponseData.fromJson(Map<String, dynamic> json) => QrResponseData(
        id: json['id']?.toString() ?? '',
        network: json['network']?.toString() ?? '',
        asset: json['asset']?.toString() ?? '',
        amount: json['amount'] is String
            ? num.tryParse(json['amount']) ?? 0
            : (json['amount'] ?? 0),
        address: json['address']?.toString() ?? '',
        qrCodeUrl: json['qrCodeUrl']?.toString() ?? '',
        expiresAtMs: (() {
          final dynamic val = json['expiresAtMs'] ?? json['expiresAt'];

          if (val == null) {
            return DateTime.now().millisecondsSinceEpoch + 30 * 60 * 1000;
          }

          int ms = 0;

          final num? parsedNum = num.tryParse(val.toString());

          if (parsedNum != null) {
            ms = parsedNum.toInt();
          } else {
            final date = DateTime.tryParse(val.toString());
            if (date != null) {
              ms = date.millisecondsSinceEpoch;
            }
          }

          if (ms == 0) {
            return DateTime.now().millisecondsSinceEpoch + 30 * 60 * 1000;
          }

          if (ms < 10000000000) {
            ms *= 1000;
          } else if (ms > 10000000000000) {
            ms = ms ~/ 1000;
            if (ms > 10000000000000) {
              ms = ms ~/ 1000;
            }
          }

          return ms;
        })(),
        paymentUrl: json['paymentUrl']?.toString(),
      );
}

class ApoloPayOptions {
  final ApoloPayClient client;
  final String processId;
  final String productTitle;
  final Function(ClientResponse<QrResponseData>) onSuccess;
  final Function(ClientError) onError;

  ApoloPayOptions({
    required this.client,
    required this.processId,
    this.productTitle = '',
    required this.onSuccess,
    required this.onError,
  });
}
