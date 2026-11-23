import { PaymentOptions, QrRequestDetails, QrResponseData } from "../types/payment-client-types";
import { Asset } from "../types/asset";
import { ClientCode, ClientError, ClientResponse } from "../types/client-response";
import { APOLOPAY_NETWORK_ID } from "../types/network";
import { appURL } from "../utils/variables";
import { generateQrCodeDataUri } from "../utils/qr-code";
import { I18n } from "../i18n";

/**
 * Max time to wait for a REST request before giving up. Without it, an unreachable host (DNS
 * failure, server down) leaves the button stuck in "loading" for as long as the browser's own
 * network timeout (20+ s).
 */
export const REQUEST_TIMEOUT_MS = 10_000;

/** `fetch` that aborts (and rejects) after {@link REQUEST_TIMEOUT_MS}, covering the body read too. */
async function fetchJsonWithTimeout(url: string, init: RequestInit): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export class Repository {
  static headers = (publicKey?: string) => {
    const options: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (publicKey) options['x-public-key'] = publicKey!

    return options
  }

  /** @param apiUrl REST API base URL (from `SmartPayClient.getApiUrl()`), without trailing slash. */
  static async getAssets(apiUrl: string): Promise<ClientResponse<Asset[]>> {
    try {
      const data = await fetchJsonWithTimeout(`${apiUrl}/payment-button/assets`, {
        method: 'GET',
        headers: this.headers(),
      })

      return ClientResponse.fromJson<Asset[]>(data);
    } catch (error) {
      throw ClientError.fromError(error, {
        code: ClientCode.get_assets_error,
        message: I18n.t.errors.getAssetsError
      });
    }
  }

  /** @param apiUrl REST API base URL (from `SmartPayClient.getApiUrl()`), without trailing slash. */
  static async fetchQrCodeDetails(apiUrl: string, {
    processId,
    assetId,
    networkId,
    publicKey
  }: (QrRequestDetails & Omit<PaymentOptions, 'onSuccess' | 'onError'>)): Promise<ClientResponse<QrResponseData>> {
    try {
      const data = await fetchJsonWithTimeout(`${apiUrl}/payment-button/process/confirm`, {
        method: 'POST',
        headers: this.headers(publicKey),
        body: JSON.stringify({
          processId,
          assetId,
          networkId
        })
      });

      if (!data.result) {
        throw new ClientError({
          code: ClientCode.paymentProcessNotAvailable,
          message: I18n.t.errors.paymentProcessNotAvailable
        });
      }

      const wallet = data.result.wallet;
      const network = data.result.network;

      const address = network === APOLOPAY_NETWORK_ID ?
        `${appURL}/payment-process/${processId}` :
        wallet

      return ClientResponse.fromJson<QrResponseData>(data, {
        result: (json) => {
          const now = Date.now();
          const defaultMilliseconds = now + 10 * 60 * 1000

          let rawVal = json.expiresAtMs ?? json.expiresAt;

          const calculateExpiration = (val: any): number => {
            if (!val) return defaultMilliseconds;

            let ms = 0;

            if (!isNaN(Number(val))) {
              ms = Number(val);
            }
            else if (typeof val === 'string') {
              const parsed = new Date(val).getTime();
              if (!isNaN(parsed)) ms = parsed;
            }

            if (ms === 0) return defaultMilliseconds;

            if (ms < 10000000000) {
              ms *= 1000;
            }
            else if (ms > 10000000000000) {
              while (ms > 20000000000000) {
                ms = Math.floor(ms / 1000);
              }
            }

            return ms;
          };

          const expiresAtMs = calculateExpiration(rawVal);

          return {
            ...json,
            address,
            qrCodeUrl: generateQrCodeDataUri(address),
            paymentUrl: address.startsWith('http') ? address : undefined,
            expiresAtMs
          }
        }
      })
    } catch (error) {
      throw ClientError.fromError(error, {
        code: ClientCode.qr_fetch_error,
        message: I18n.t.errors.qrFetchError
      });
    }
  }
}