import { PaymentOptions, QrRequestDetails, QrResponseData } from "../types/payment-client-types";
import { Asset } from "../types/asset";
import { ClientError, ClientResponse } from "../types/client-response";

export class Repository {
  static apiUrl = "https://pb-test-api.apolopay.app"

  static headers = (publicKey?: string) => {
    const options: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (publicKey) options['x-public-key'] = publicKey!

    return options
  }

  static async getAssets(): Promise<ClientResponse<Asset[]>> {
    try {
      const response = await fetch(`${this.apiUrl}/payment-button/assets`, {
        method: 'GET',
        headers: this.headers(),
      })
      const data = await response.json()

      return ClientResponse.fromJson<Asset[]>(data);
    } catch (error) {
      throw ClientError.fromError(error, {
        code: 'get_assets_error',
        message: 'Error al obtener los activos'
      });
    }
  }

  static async fetchQrCodeDetails({
    processId,
    assetId,
    networkId,
    publicKey
  }: (QrRequestDetails & Omit<PaymentOptions, 'onSuccess' | 'onError'>)): Promise<ClientResponse<QrResponseData>> {
    try {
      const response = await fetch(`${this.apiUrl}/payment-button/process/confirm`, {
        method: 'POST',
        headers: this.headers(publicKey),
        body: JSON.stringify({
          processId,
          assetId,
          networkId
        })
      }),
        data = await response.json();

      if (!data.result) {
        throw new ClientError({
          code: data.status || 'qr_fetch_error',
          message: data.message || 'Error al obtener los detalles del código QR'
        });
      }

      const wallet = data.result.wallet;
      const network = data.result.network;

      // TODO review if enable testing environment switch to the address
      const address = network === "apolopay" ?
        `https://p2p.apolopay.app/payment-process/${processId}` :
        wallet

      return ClientResponse.fromJson<QrResponseData>(data, {
        result: (json) => {
          // Check both expiresAtMs and expiresAt (ISO string or timestamp)
          let expiresAtMs = json.expiresAtMs || json.expiresAt || (Date.now() + 30 * 60 * 1000);

          if (typeof expiresAtMs === 'string') {
            expiresAtMs = new Date(expiresAtMs).getTime();
          }

          // Normalize nanoseconds/microseconds to milliseconds
          if (typeof expiresAtMs === 'number' && expiresAtMs > 10000000000000) {
            while (expiresAtMs > 2000000000000) {
              expiresAtMs = Math.floor(expiresAtMs / 1000);
            }
          }

          return {
            ...json,
            address,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}&ecc=H`,
            paymentUrl: address.startsWith('http') ? address : undefined,
            expiresAtMs: isNaN(expiresAtMs as number) ? (Date.now() + 30 * 60 * 1000) : expiresAtMs
          }
        }
      })
    } catch (error) {
      throw ClientError.fromError(error, {
        code: 'fetch_qr_code_details_error',
        message: 'Error al obtener los detalles del código QR'
      });
    }
  }
}