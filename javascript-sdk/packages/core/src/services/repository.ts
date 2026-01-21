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
    amount,
    assetId,
    networkId,
    metadata,
    publicKey
  }: (QrRequestDetails & Omit<PaymentOptions, 'onSuccess' | 'onError'>)): Promise<ClientResponse<QrResponseData>> {
    const metadataString = metadata ? JSON.stringify(metadata) : undefined

    try {
      const response = await fetch(`${this.apiUrl}/payment-button/process`, {
        method: 'POST',
        headers: this.headers(publicKey),
        body: JSON.stringify({
          amount,
          assetId,
          networkId,
          metadata: metadataString,
        })
      })
      const data = await response.json(),
        wallet = data.result.wallet

      // TODO review if enable testing environment switch to the address
      const address = data.network === "apolopay" ?
        `https://p2p.apolopay.app/payment/${wallet}` :
        wallet

      return ClientResponse.fromJson<QrResponseData>(data, {
        result: (json) => ({
          ...json,
          address,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${json.address}&ecc=H`,
          expiresAt: json.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString()
        })
      })
    } catch (error) {
      throw ClientError.fromError(error, {
        code: 'fetch_qr_code_details_error',
        message: 'Error al obtener los detalles del código QR'
      });
    }
  }
}