/// Default Nexora SmartPay REST API base URL.
const String defaultApiUrl = 'https://api.smartpaylatam.com';

/// Default Nexora SmartPay realtime (Socket.IO) base URL.
const String defaultSocketUrl = 'https://ws.smartpaylatam.com';

/// Same SmartPay backend, served on Apolo Pay's old API host. Available during
/// the Apolo -> Nexora transition so an integrator can point at it explicitly
/// (`SmartPayClient(publicKey: ..., apiUrl: legacyApoloApiUrl)`).
const String legacyApoloApiUrl = 'https://pb-api.apolopay.app';

/// Same SmartPay backend, served on Apolo Pay's old realtime host. Available
/// during the Apolo -> Nexora transition (`socketUrl: legacyApoloSocketUrl`).
const String legacyApoloSocketUrl = 'https://pb-ws.apolopay.app';

const Set<String> _localDevHosts = {'localhost', '127.0.0.1'};

/// Validates [value] and returns it without trailing slashes.
///
/// Only `https://` is accepted, except `http://localhost` /
/// `http://127.0.0.1` for local development. Throws [ArgumentError] otherwise.
String _normalizeBaseUrl(String value, String name) {
  final trimmed = value.trim();
  final uri = Uri.tryParse(trimmed);

  if (uri == null || !uri.hasScheme || uri.host.isEmpty) {
    throw ArgumentError.value(
      value,
      name,
      '[Nexora SmartPay] Invalid $name: not a valid absolute URL',
    );
  }

  final isHttps = uri.scheme == 'https';
  final isLocalHttp = uri.scheme == 'http' && _localDevHosts.contains(uri.host);
  if (!isHttps && !isLocalHttp) {
    throw ArgumentError.value(
      value,
      name,
      '[Nexora SmartPay] Invalid $name: only https:// URLs are allowed '
      '(http:// only for localhost/127.0.0.1)',
    );
  }

  return trimmed.replaceFirst(RegExp(r'/+$'), '');
}

class SmartPayClient {
  final String publicKey;

  /// REST API base URL this client talks to, without a trailing slash.
  final String apiUrl;

  /// Realtime (Socket.IO) base URL this client connects to, without a
  /// trailing slash.
  final String socketUrl;

  /// [apiUrl] defaults to [defaultApiUrl] and [socketUrl] to
  /// [defaultSocketUrl]. Both must be `https://` (or `http://localhost` /
  /// `http://127.0.0.1`); an invalid value throws [ArgumentError].
  SmartPayClient({
    required this.publicKey,
    String? apiUrl,
    String? socketUrl,
  })  : apiUrl = _normalizeBaseUrl(apiUrl ?? defaultApiUrl, 'apiUrl'),
        socketUrl =
            _normalizeBaseUrl(socketUrl ?? defaultSocketUrl, 'socketUrl');

  String getPublicKey() => publicKey;

  String getApiUrl() => apiUrl;

  String getSocketUrl() => socketUrl;

  bool get isSandbox => publicKey.startsWith('pk_test');
}
