class Network {
  final String id;
  final String name;
  final String network;
  final String image;
  final bool isNative;

  Network({
    required this.id,
    required this.name,
    required this.network,
    required this.image,
    required this.isNative,
  });

  Network copyWith({
    String? id,
    String? name,
    String? network,
    String? image,
    bool? isNative,
  }) =>
      Network(
        id: id ?? this.id,
        name: name ?? this.name,
        network: network ?? this.network,
        image: image ?? this.image,
        isNative: isNative ?? this.isNative,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'network': network,
        'image': image,
        'isNative': isNative,
      };

  factory Network.fromJson(Map<String, dynamic> json) => Network(
        id: json['id'],
        name: json['name'],
        network: json['network'],
        image: json['image'],
        isNative: json['isNative'],
      );
}
