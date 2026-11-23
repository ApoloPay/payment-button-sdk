import { Repository } from "./repository";
import { SocketService } from "./socket-service";
import { sandboxFallbackAssets, buildSandboxQrData } from "./sandbox-data";
import { Asset } from "../types/asset";
import { withoutApoloPayNetworks } from "../types/network";
import { PaymentSessionOptions, QrRequestDetails, QrResponseData } from "../types/payment-client-types";
import { SmartPayClient } from "../smart-pay-client";

export class PaymentService {
  private client: SmartPayClient;
  private socket: SocketService;
  private assets: Asset[] = [];

  constructor(client: SmartPayClient) {
    this.client = client;
    this.socket = new SocketService(this.client);
  }

  public getPublicKey(): string {
    return this.client.getPublicKey();
  }

  // --- Métodos para obtener datos ---
  public async getAssets(): Promise<Asset[]> {
    if (this.client.isSandbox()) {
      // The catalog endpoint is public and holds no payment/wallet data, so we
      // still fetch it in sandbox mode just to reuse its real asset/network icons.
      try {
        const assets = await Repository.getAssets(this.client.getApiUrl());
        this.assets = withoutApoloPayNetworks(assets.result!);
      } catch {
        this.assets = sandboxFallbackAssets;
      }
      return this.assets;
    }

    const assets = await Repository.getAssets(this.client.getApiUrl());
    this.assets = withoutApoloPayNetworks(assets.result!);

    return this.assets;
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails, session: PaymentSessionOptions): Promise<QrResponseData> {
    if (this.client.isSandbox()) {
      const pool = this.assets.length ? this.assets : sandboxFallbackAssets;
      const asset = pool.find(a => a.id === details.assetId) ?? pool[0];
      const network = asset.networks.find(n => n.id === details.networkId) ?? asset.networks[0];

      return buildSandboxQrData({ processId: session.processId, asset, network });
    }

    const qrData = await Repository.fetchQrCodeDetails(this.client.getApiUrl(), {
      ...details,
      processId: session.processId,
      publicKey: this.client.getPublicKey()
    });

    this.socket.connect(session);

    return qrData.result!;
  }

  public disconnectWebSocket(): void {
    this.socket.disconnect();
  }
}