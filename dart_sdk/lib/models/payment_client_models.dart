// Detalles que necesitamos para obtener el QR
import 'package:payment_button_sdk/models/client_response.dart';

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
  final Map<String, dynamic>? metadata;
  final String address;
  final String qrCodeUrl;
  final int expiresAtMs;

  QrResponseData({
    required this.id,
    required this.network,
    required this.asset,
    required this.amount,
    this.metadata,
    required this.address,
    required this.qrCodeUrl,
    required this.expiresAtMs,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'network': network,
        'asset': asset,
        'amount': amount,
        'metadata': metadata,
        'address': address,
        'qrCodeUrl': qrCodeUrl,
        'expiresAtMs': expiresAtMs,
      };

  factory QrResponseData.fromJson(Map<String, dynamic> json) => QrResponseData(
        id: json['id'],
        network: json['network'],
        asset: json['asset'],
        amount: json['amount'],
        metadata: json['metadata'],
        address: json['address'],
        qrCodeUrl: json['qrCodeUrl'],
        expiresAtMs: json['expiresAtMs'],
      );
}

class PaymentOptions {
  final String publicKey;
  final double amount;
  final Map<String, dynamic>? metadata;
  final Function(ClientResponse<QrResponseData>) onSuccess;
  final Function(ClientError) onError;

  PaymentOptions({
    required this.publicKey,
    required this.amount,
    this.metadata,
    required this.onSuccess,
    required this.onError,
  });
}
