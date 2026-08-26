class ApoloPayClient {
  final String publicKey;

  ApoloPayClient({
    required this.publicKey,
  });

  String getPublicKey() => publicKey;

  bool get isSandbox => publicKey.startsWith('pk_test');
}
