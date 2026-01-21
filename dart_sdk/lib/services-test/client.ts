import { Repository } from "./services/repository";
import { Socket } from "./services/socket";
import { Asset } from "./types/asset";
import { PaymentOptions, QrRequestDetails, QrResponseData } from "./types/payment-client-types";


// --- Clase PaymentClient ---
export class PaymentClient {
  private options: PaymentOptions;
  private socket: Socket;

  constructor(options: PaymentOptions) {
    this.options = options;
    this.socket = new Socket(this.options);
  }

  // --- Métodos para obtener datos ---
  public async getAssets(): Promise<Asset[]> {
    const assets = await Repository.getAssets();

    return assets.result;
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails): Promise<QrResponseData> {
    const qrData = await Repository.fetchQrCodeDetails({
      ...details,
      amount: this.options.amount,
      metadata: this.options.metadata,
      publicKey: this.options.publicKey
    });

    this.socket.connectWebSocket(qrData.result.id);

    return qrData.result;
  }

  public disconnectWebSocket(): void {
    this.socket.disconnectWebSocket();
  }
}