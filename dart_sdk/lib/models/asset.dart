import 'package:payment_button_sdk/models/network.dart';

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
