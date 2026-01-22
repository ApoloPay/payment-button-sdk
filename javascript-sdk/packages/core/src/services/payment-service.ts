import { Repository } from "./repository";
import { SocketService } from "./socket-service";
import { Asset } from "../types/asset";
import { PaymentSessionOptions, QrRequestDetails, QrResponseData } from "../types/payment-client-types";
import { ApoloPayClient } from "../apolo-pay-client";

export class PaymentService {
  private client: ApoloPayClient;
  private socket: SocketService;

  constructor(client: ApoloPayClient) {
    this.client = client;
    this.socket = new SocketService(this.client);
  }

  public getPublicKey(): string {
    return this.client.getPublicKey();
  }

  // --- Métodos para obtener datos ---
  public async getAssets(): Promise<Asset[]> {
    const assets = await Repository.getAssets();

    return assets.result!;
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails, session: PaymentSessionOptions): Promise<QrResponseData> {
    const qrData = await Repository.fetchQrCodeDetails({
      ...details,
      processId: session.processId,
      publicKey: this.client.getPublicKey()
    });

    console.log('qrData', qrData);

    this.socket.connect(session);

    return qrData.result!;
  }

  public disconnectWebSocket(): void {
    this.socket.disconnect();
  }
}