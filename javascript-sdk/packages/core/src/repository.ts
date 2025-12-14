import { PaymentOptions, QrRequestDetails, QrResponseData } from "./types/payment-client-types";
import { Asset } from "./types/asset";

export class Repository {
  static apiUrl = "https://pb-test-api.apolopay.app"
  static wsUrl = "wss://api.apolopay.com"

  static headers = (publicKey?: string) => {
    const options: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (publicKey) options['x-public-key'] = publicKey!

    return options
  }

  static async getAssets(): Promise<Asset[]> {
    const response = await fetch(`${this.apiUrl}/payment-button/assets`, {
      method: 'GET',
      headers: this.headers(),
    })
    const data = await response.json()

    return data;
  }

  static async fetchQrCodeDetails({
    amount,
    assetId,
    networkId,
    metadata,
    publicKey
  }: (QrRequestDetails & Omit<PaymentOptions, 'onSuccess' | 'onError'>)): Promise<QrResponseData> {
    const metadataString = metadata ? JSON.stringify(metadata) : undefined

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
    const data = await response.json()

    // TODO review if enable testing environment switch to the address
    const address = data.network === "apolopay" ?
      `https://p2p.apolopay.app/payment/${data.wallet}` :
      data.wallet

    return {
      network: data.network,
      asset: data.asset,
      amount: data.amount,
      metadata: data.metadata,
      address,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}&ecc=H`,
      expiresAt: data.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }
  }
}