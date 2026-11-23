class SmartPayClient {
  final String publicKey;

  SmartPayClient({
    required this.publicKey,
  });

  String getPublicKey() => publicKey;

  bool get isSandbox => publicKey.startsWith('pk_test');
}
