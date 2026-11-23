import 'package:nexora_smartpay_sdk/models/network.dart';

class Asset {
  final String id;
  final String name;
  final String symbol;
  final String image;
  final List<Network> networks;

  Asset({
    required this.id,
    required this.name,
    required this.symbol,
    required this.image,
    required this.networks,
  });

  Asset copyWith({
    String? id,
    String? name,
    String? symbol,
    String? image,
    List<Network>? networks,
  }) =>
      Asset(
        id: id ?? this.id,
        name: name ?? this.name,
        symbol: symbol ?? this.symbol,
        image: image ?? this.image,
        networks: networks ?? this.networks,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'symbol': symbol,
        'image': image,
        'networks': networks.map((network) => network.toJson()).toList(),
      };

  factory Asset.fromJson(Map<String, dynamic> json) => Asset(
        id: json['id'],
        name: json['name'],
        symbol: json['symbol'],
        image: json['image'],
        networks: (json['networks'] as List)
            .map((network) => Network.fromJson(network))
            .toList(),
      );

  static List<Asset> listFrom(List json) =>
      json.map((a) => Asset.fromJson(a)).toList();
}

/// Nexora never offers paying from the Apolo Pay app: the backend stops
/// sending that network, and the SDK drops it anyway if it ever does, along
/// with an asset left without networks.
List<Asset> withoutApoloPayNetworks(List<Asset> assets) => [
      for (final asset in assets)
        if (asset.networks.where((n) => !n.isApoloPay).toList()
            case final networks when networks.isNotEmpty)
          networks.length == asset.networks.length
              ? asset
              : asset.copyWith(networks: networks),
    ];
