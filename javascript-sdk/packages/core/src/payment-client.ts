import { Repository } from "./repository";
import { Asset } from "./types/asset";
import { PaymentOptions, QrRequestDetails, QrResponseData, WebSocketMessage } from "./types/payment-client-types";


// --- Clase PaymentClient ---
export class PaymentClient {
  private options: PaymentOptions;
  private socket: WebSocket | null = null;

  constructor(options: PaymentOptions) {
    this.options = options;
    console.log('PaymentClient initialized');
  }

  // --- Métodos para obtener datos ---
  public async getAssets(): Promise<Asset[]> {
    const assets = await Repository.getAssets();

    return assets;
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails): Promise<QrResponseData> {
    const qrData = await Repository.fetchQrCodeDetails({
      ...details,
      amount: this.options.amount,
      email: this.options.email,
      publicKey: this.options.publicKey
    });

    return qrData;
  }

  // --- CORRECCIÓN EN WEBSOCKET ---
  private connectWebSocket(paymentId: string): void {
    // 1. Verificación de entorno (Vital para SSR como Next.js o Astro)
    if (typeof window === 'undefined' || !window.WebSocket) {
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket ya conectado o conectando.');
      return;
    }

    console.log(`Conectando a WebSocket para paymentId: ${paymentId}...`);
    
    // 2. Uso nativo del navegador
    this.socket = new WebSocket(`${Repository.wsUrl}?paymentId=${paymentId}`);

    this.socket.onopen = () => {
      console.log('WebSocket Conectado.');
    };

    // 3. Tipado correcto del evento (MessageEvent)
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        // En el navegador, event.data ya suele ser string. 
        // .toString() es redundante pero seguro si viene texto.
        // OJO: Si viene un Blob, necesitarías .text() await. Asumimos texto JSON.
        const message: WebSocketMessage = JSON.parse(event.data as string);
        
        console.log('Mensaje WebSocket recibido:', message);
        this.handleWebSocketMessage(message);
      } catch (e) {
        console.error('Error al procesar mensaje WebSocket:', e);
      }
    };

    this.socket.onerror = (event: Event) => {
      console.error('Error en WebSocket:', event);
      this.options.onError({ code: 'WEBSOCKET_ERROR', message: 'Error de conexión en tiempo real.' });
      this.disconnectWebSocket();
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log(`WebSocket Desconectado: code=${event.code}`);
      this.socket = null;
    };
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'paymentConfirmation':
        // El backend confirma el pago
        this.options.onSuccess({
          transactionId: message.data.transactionId || 'N/A', // Ajusta según tu payload
          status: 'success'
        });
        this.disconnectWebSocket();
        break;
      case 'paymentError':
        // El backend reporta un error (ej. timeout, monto incorrecto)
        this.options.onError({
          code: message.data.code || 'PAYMENT_FAILED', // Ajusta según tu payload
          message: message.data.message || 'El pago falló.'
        });
        this.disconnectWebSocket();
        break;
      case 'pending':
        // Mensaje informativo, no hacemos nada o actualizamos UI
        console.log('Pago aún pendiente...');
        break;
      default:
        console.warn('Tipo de mensaje WebSocket desconocido:', message.type);
    }
  }

  // --- disconnectWebSocket (Add environment check) ---
  public disconnectWebSocket(): void {
    // Only run in browser
    if (typeof window === 'undefined' || !this.socket) {
        return;
    }
    
    // Verificamos constantes estáticas nativas
    if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        console.log('Disconnecting WebSocket...');
        this.socket.close();
    }
    this.socket = null;
  }
}