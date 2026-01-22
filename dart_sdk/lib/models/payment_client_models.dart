import 'package:payment_button_sdk/models/client_response.dart';
import 'package:payment_button_sdk/services/apolo_pay_client.dart';

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

  QrResponseData({
    required this.id,
    required this.network,
    required this.asset,
    required this.amount,
    required this.address,
    required this.qrCodeUrl,
    required this.expiresAtMs,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'network': network,
        'asset': asset,
        'amount': amount,
        'address': address,
        'qrCodeUrl': qrCodeUrl,
        'expiresAtMs': expiresAtMs,
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
          dynamic val = json['expiresAtMs'] ?? json['expiresAt'];

          if (val == null) {
            return DateTime.now().millisecondsSinceEpoch + 30 * 60 * 1000;
          }

          int milliseconds = 0;
          if (val is String) {
            final parsedDate = DateTime.tryParse(val);
            if (parsedDate != null) {
              milliseconds = parsedDate.millisecondsSinceEpoch;
            } else {
              milliseconds = int.tryParse(val) ?? 0;
            }
          } else if (val is num) {
            milliseconds = val.toInt();
          }

          if (milliseconds == 0) {
            return DateTime.now().millisecondsSinceEpoch + 30 * 60 * 1000;
          }

          // Normalize:
          // 1. Seconds (10 digits)? Multiply by 1000
          if (milliseconds < 10000000000) {
            milliseconds *= 1000;
          }
          // 2. Nanoseconds/Microseconds (> 10^13)? Divide by 1000
          else if (milliseconds > 10000000000000) {
            while (milliseconds > 2000000000000) {
              milliseconds ~/= 1000;
            }
          }

          final int now = DateTime.now().millisecondsSinceEpoch;

          // Safety fallback: If expiration is in the past or too close (less than 1 min),
          // assume clock skew and add 30 mins.
          if (milliseconds - now < 60000) return now + 30 * 60 * 1000;

          return milliseconds;
        })(),
      );
}

class PaymentOptions {
  final ApoloPayClient client;
  final String processId;
  final String productTitle;
  final Function(ClientResponse<QrResponseData>) onSuccess;
  final Function(ClientError) onError;

  PaymentOptions({
    required this.client,
    required this.processId,
    this.productTitle = '',
    required this.onSuccess,
    required this.onError,
  });
}
