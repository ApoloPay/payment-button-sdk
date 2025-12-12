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
    email,
    publicKey
  }: (QrRequestDetails & Omit<PaymentOptions, 'onSuccess' | 'onError'>)): Promise<QrResponseData> {
    const response = await fetch(`${this.apiUrl}/payment-button/process`, {
      method: 'POST',
      headers: this.headers(publicKey),
      body: JSON.stringify({
        amount,
        assetId,
        networkId,
        metadata: {
          orderId: "ORD-9821",
          customerEmail: email
        },
      })
    })
    const data = await response.json()
    console.log(data, 'data');

    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      paymentId: `pay_${Date.now()}`,
      address: `0xAddress_${assetId}_${networkId}_${Date.now().toString().slice(-5)}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${assetId}_${networkId}&ecc=H`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }
  }
}