import { QrRequestDetails, QrResponseData } from ".";

export class Repository {
  static async getStableCoins(): Promise<any[]> {
    console.log('Obteniendo stablecoins...');

    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
      { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
      { id: 'usdt', name: 'Tether', symbol: 'USDT' },
    ];
  }

  static async getBlockchains(): Promise<any[]> {
    console.log('Obteniendo blockchains...');
    await new Promise(resolve => setTimeout(resolve, 500)); 

    return [
      { id: 'polygon', name: 'Polygon' },
      { id: 'bsc', name: 'BNB Chain' },
      { id: 'arbitrum', name: 'Arbitrum'},
    ];
  }

  static async fetchQrCodeDetails(details: QrRequestDetails & { amount: number }): Promise<QrResponseData> {
    console.log(`Requesting QR details for ${details.amount} ${details.coinId} via ${details.chainId}`);

    await new Promise(resolve => setTimeout(resolve, 700));
    const mockQrData: QrResponseData = {
      paymentId: `pay_${Date.now()}`,
      address: `0xAddress_${details.coinId}_${details.chainId}_${Date.now().toString().slice(-5)}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${details.coinId}_${details.chainId}_${Date.now()}`
    };
    return mockQrData
  }
}