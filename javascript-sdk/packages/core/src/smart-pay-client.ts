/** Default Nexora SmartPay REST API base URL. */
export const DEFAULT_API_URL = 'https://api.smartpaylatam.com';
/** Default Nexora SmartPay realtime (Socket.IO) base URL. */
export const DEFAULT_SOCKET_URL = 'https://ws.smartpaylatam.com';

/**
 * Same SmartPay backend, served on Apolo Pay's old API host. Available during the
 * Apolo -> Nexora transition so an integrator can point at it explicitly
 * (`new SmartPayClient({ publicKey, apiUrl: LEGACY_APOLO_API_URL })`).
 */
export const LEGACY_APOLO_API_URL = 'https://pb-api.apolopay.app';
/**
 * Same SmartPay backend, served on Apolo Pay's old realtime host. Available during the
 * Apolo -> Nexora transition (`socketUrl: LEGACY_APOLO_SOCKET_URL`).
 */
export const LEGACY_APOLO_SOCKET_URL = 'https://pb-ws.apolopay.app';

export interface SmartPayClientOptions {
  publicKey: string;
  /** REST API base URL. Defaults to `DEFAULT_API_URL`. Must be `https://` on `*.smartpaylatam.com` (or a `LEGACY_APOLO_*` host), or `localhost` / `127.0.0.1` for local development. */
  apiUrl?: string;
  /** Realtime (Socket.IO) base URL. Defaults to `DEFAULT_SOCKET_URL`. Same scheme rules as `apiUrl`. */
  socketUrl?: string;
}

const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1']);

/**
 * The only domain (and its subdomains: production, sandbox, testing) a client may
 * talk to, besides the legacy Apolo hosts and localhost. Pointing the SDK anywhere
 * else (a lookalike server showing its own deposit address, or a typo) fails at
 * construction instead of mid-payment; a new Nexora host means a new SDK release.
 */
const SMARTPAY_DOMAIN = 'smartpaylatam.com';

/** Apolo Pay's old hosts, still serving the same backend during the transition. */
const LEGACY_APOLO_HOSTS = new Set(['pb-api.apolopay.app', 'pb-ws.apolopay.app']);

function isAllowedHost(host: string): boolean {
  return (
    host === SMARTPAY_DOMAIN ||
    host.endsWith(`.${SMARTPAY_DOMAIN}`) ||
    LEGACY_APOLO_HOSTS.has(host) ||
    LOCAL_DEV_HOSTS.has(host)
  );
}

/**
 * Validates a base URL and returns it without trailing slashes.
 * Only `https://` is accepted, except `http://localhost` / `http://127.0.0.1` for local development.
 */
function normalizeBaseUrl(value: string, optionName: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`[Nexora SmartPay] Invalid ${optionName} "${value}": not a valid absolute URL.`);
  }

  const isHttps = parsed.protocol === 'https:';
  const isLocalHttp = parsed.protocol === 'http:' && LOCAL_DEV_HOSTS.has(parsed.hostname);
  if (!isHttps && !isLocalHttp) {
    throw new Error(
      `[Nexora SmartPay] Invalid ${optionName} "${value}": only https:// URLs are allowed (http:// only for localhost/127.0.0.1).`
    );
  }

  if (!isAllowedHost(parsed.hostname.toLowerCase())) {
    throw new Error(
      `[Nexora SmartPay] Invalid ${optionName} "${value}": host "${parsed.hostname}" is not a Nexora SmartPay host (*.${SMARTPAY_DOMAIN}).`
    );
  }

  return value.trim().replace(/\/+$/, '');
}

export class SmartPayClient {
  private publicKey: string;
  private apiUrl: string;
  private socketUrl: string;

  constructor(options: SmartPayClientOptions) {
    this.publicKey = options.publicKey;
    this.apiUrl = normalizeBaseUrl(options.apiUrl ?? DEFAULT_API_URL, 'apiUrl');
    this.socketUrl = normalizeBaseUrl(options.socketUrl ?? DEFAULT_SOCKET_URL, 'socketUrl');
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  /** REST API base URL this client talks to, without a trailing slash. */
  public getApiUrl(): string {
    return this.apiUrl;
  }

  /** Realtime (Socket.IO) base URL this client connects to, without a trailing slash. */
  public getSocketUrl(): string {
    return this.socketUrl;
  }

  public isSandbox(): boolean {
    return this.publicKey.startsWith('pk_test');
  }
}

/** @deprecated Use `SmartPayClient` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export const ApoloPayClient = SmartPayClient;
/** @deprecated Use `SmartPayClient` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export type ApoloPayClient = SmartPayClient;
/** @deprecated Use `SmartPayClientOptions` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export type ApoloPayClientOptions = SmartPayClientOptions;
