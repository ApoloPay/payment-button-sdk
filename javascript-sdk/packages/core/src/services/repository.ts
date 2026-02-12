import { PaymentOptions, QrRequestDetails, QrResponseData } from "../types/payment-client-types";
import { Asset } from "../types/asset";
import { ClientError, ClientResponse } from "../types/client-response";
import { apiURL, appURL } from "../utils/variables";

export class Repository {
  static headers = (publicKey?: string) => {
    const options: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (publicKey) options['x-public-key'] = publicKey!

    return options
  }

  static async getAssets(): Promise<ClientResponse<Asset[]>> {
    try {
      const response = await fetch(`${apiURL}/payment-button/assets`, {
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
      const response = await fetch(`${apiURL}/payment-button/process/confirm`, {
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
        `${appURL}/payment-process/${processId}` :
        wallet

      return ClientResponse.fromJson<QrResponseData>(data, {
        result: (json) => {
          const now = Date.now();
          const defaultMilliseconds = now + 30 * 60 * 1000

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
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}&ecc=H`,
            paymentUrl: address.startsWith('http') ? address : undefined,
            expiresAtMs
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