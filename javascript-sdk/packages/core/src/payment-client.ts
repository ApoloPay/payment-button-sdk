import { Repository } from "./services/repository";
import { SocketService } from "./services/socket_service";
import { Asset } from "./types/asset";
import { PaymentOptions, QrRequestDetails, QrResponseData } from "./types/payment-client-types";

// --- Clase PaymentClient ---
export class PaymentClient {
  private options: PaymentOptions;
  private socket: SocketService;

  constructor(options: PaymentOptions) {
    this.options = options;
    this.socket = new SocketService(this.options);
  }

  // --- Métodos para obtener datos ---
  public async getAssets(): Promise<Asset[]> {
    const assets = await Repository.getAssets();

    return assets.result!;
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails): Promise<QrResponseData> {
    const qrData = await Repository.fetchQrCodeDetails({
      ...details,
      amount: this.options.amount,
      metadata: this.options.metadata,
      publicKey: this.options.publicKey
    });

    console.log('qrData', qrData);

    this.socket.connect(qrData.result!.id);

    return qrData.result!;
  }

  public disconnectWebSocket(): void {
    this.socket.disconnect();
  }
}