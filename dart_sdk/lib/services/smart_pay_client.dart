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

/// The only domain (and its subdomains: production, sandbox, testing) a
/// client may talk to, besides [_legacyApoloHosts] and [_localDevHosts].
/// Pointing the SDK anywhere else (a lookalike server showing its own
/// deposit address, or a typo) fails here instead of mid-payment; a new
/// Nexora host means a new SDK release.
const String _smartPayDomain = 'smartpaylatam.com';

/// Apolo Pay's old hosts, still serving the same backend during the
/// transition.
const Set<String> _legacyApoloHosts = {
  'pb-api.apolopay.app',
  'pb-ws.apolopay.app'
};

bool _isAllowedHost(String host) =>
    host == _smartPayDomain ||
    host.endsWith('.$_smartPayDomain') ||
    _legacyApoloHosts.contains(host) ||
    _localDevHosts.contains(host);

/// Validates [value] and returns it without trailing slashes.
///
/// Only `https://` on Nexora's own hosts (or Apolo Pay's legacy ones) is
/// accepted, plus `http(s)://localhost` / `127.0.0.1` for local
/// development. Throws [ArgumentError] otherwise.
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

  if (!_isAllowedHost(uri.host.toLowerCase())) {
    throw ArgumentError.value(
      value,
      name,
      '[Nexora SmartPay] Invalid $name: host "${uri.host}" is not a Nexora '
      'SmartPay host (*.$_smartPayDomain)',
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
  /// [defaultSocketUrl]. Both must be `https://` on a Nexora SmartPay host
  /// (`*.smartpaylatam.com`, or [legacyApoloApiUrl] / [legacyApoloSocketUrl]),
  /// or `localhost` / `127.0.0.1`; anything else throws [ArgumentError].
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
