import { WebSocket } from 'ws';

export interface PaymentOptions {
  apiKey: string;
  amount: number;
  onSuccess: (response: PaymentResponse) => void;
  onError: (error: PaymentError) => void;
  // (Opcional) Podrías añadir una URL base para tu API y WebSocket
  // apiBaseUrl?: string;
  // wsBaseUrl?: string;
}

// Detalles que necesitamos para obtener el QR
export interface QrRequestDetails {
  coinId: string;
  chainId: string;
}

// Lo que esperamos recibir para mostrar el QR
export interface QrResponseData {
  paymentId: string; // ID único para esta transacción (para el WebSocket)
  address: string;   // La dirección a la que enviar los fondos
  qrCodeUrl: string; // URL de la imagen del QR (o los datos para generarla)
  // (Podría incluir también el monto exacto en crypto a enviar)
  // expectedAmountCrypto?: string; 
}

// Tipos para WebSocket (Ejemplo)
interface WebSocketMessage {
  type: 'paymentConfirmation' | 'paymentError' | 'pending';
  data: any; // El payload dependerá de tu backend
}

// --- Interfaces de Respuesta (iguales) ---
export interface PaymentResponse {
  transactionId: string;
  status: 'success';
}
export interface PaymentError {
  code: string;
  message: string;
}

// --- Clase PaymentClient (Refactorizada) ---
export class PaymentClient {
  private options: PaymentOptions;
  private socket: WebSocket | null = null;
  // (Opcional) URL del WebSocket, podría venir de las options o ser fija
  private wsUrl = 'wss://tu-websocket.com/pagos'; 

  constructor(options: PaymentOptions) {
    this.options = options;
    console.log('PaymentClient inicializado');
  }

  // --- Métodos para obtener datos ---
  public async getStableCoins(): Promise<any[]> {
    console.log('Obteniendo stablecoins...');
    // --- Reemplaza con tu llamada real a la API ---
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
      { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
      { id: 'usdt', name: 'Tether', symbol: 'USDT' },
    ];
  }

  public async getBlockchains(): Promise<any[]> {
     console.log('Obteniendo blockchains...');
    // --- Reemplaza con tu llamada real a la API ---
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 'polygon', name: 'Polygon' },
      { id: 'bsc', name: 'BNB Chain' },
      { id: 'arbitrum', name: 'Arbitrum'},
    ];
  }

  // --- Método para obtener datos del QR ---
  public async fetchQrCodeDetails(details: QrRequestDetails): Promise<QrResponseData> {
    console.log(`Requesting QR details for ${this.options.amount} ${details.coinId} via ${details.chainId}`);

    // --- Replace with your actual API call ---
    try {
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
      const mockQrData: QrResponseData = {
        paymentId: `pay_${Date.now()}`,
        address: `0xAddress_${details.coinId}_${details.chainId}_${Date.now().toString().slice(-5)}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${details.coinId}_${details.chainId}_${Date.now()}`
      };

      return mockQrData; 

    } catch (apiError) {
      console.error("Error fetching QR data:", apiError);
      throw new Error('Could not generate payment information.'); 
    }
  }

  // --- Métodos para WebSocket ---
  private connectWebSocket(paymentId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket ya conectado.');
      return;
    }

    console.log(`Conectando a WebSocket para paymentId: ${paymentId}...`);
    // Añade el paymentId a la URL o envíalo en un mensaje inicial, según tu backend
    this.socket = new WebSocket(`${this.wsUrl}?paymentId=${paymentId}`, {
      // headers: { 'Authorization': `Bearer ${this.options.apiKey}` } // Si necesitas auth
    });

    this.socket.onopen = () => {
      console.log('WebSocket Conectado.');
      // Podrías enviar un mensaje de suscripción si tu backend lo requiere
      // this.socket?.send(JSON.stringify({ type: 'subscribe', paymentId }));
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data.toString());
        console.log('Mensaje WebSocket recibido:', message);
        this.handleWebSocketMessage(message);
      } catch (e) {
        console.error('Error al procesar mensaje WebSocket:', e);
      }
    };

    this.socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      // Llama a onError con un error específico de WebSocket
      this.options.onError({ code: 'WEBSOCKET_ERROR', message: 'Error de conexión en tiempo real.' });
      this.disconnectWebSocket();
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket Desconectado: code=${event.code}, reason=${event.reason}`);
      // Solo llama a onError si no fue un cierre esperado (ej. después de 'success')
      // Necesitarás lógica adicional para determinar si fue inesperado.
      // if (/* cierre inesperado */) {
      //    this.options.onError({ code: 'WEBSOCKET_CLOSED', message: 'Conexión en tiempo real perdida.' });
      // }
      this.socket = null;
    };
  }

  // --- NEW Method to Start Listening (Client-Side Only) ---
  public startListening(paymentId: string): void {
    // **CRUCIAL CHECK:** Only run in browser environment
    if (typeof window === 'undefined' || !window.WebSocket) {
      console.warn('WebSocket not supported or not in a browser environment. Skipping connection.');
      // Optionally trigger an error if WebSocket is absolutely required
      // this.options.onError({ code: 'WEBSOCKET_UNSUPPORTED', message: 'Real-time updates unavailable.' });
      return; 
    }

    // Disconnect previous socket if any
    this.disconnectWebSocket(); 

    console.log(`Connecting to WebSocket for paymentId: ${paymentId}...`);
    // Use the BROWSER's native WebSocket
    this.socket = new WebSocket(`${this.wsUrl}?paymentId=${paymentId}`);

    this.socket.onopen = () => {
      console.log('WebSocket Connected.');
    };

    this.socket.onmessage = (event) => { // Use browser's MessageEvent
      try {
        // Assuming message format is the same
        const message: WebSocketMessage = JSON.parse(event.data.toString()); 
        console.log('WebSocket message received:', message);
        this.handleWebSocketMessage(message);
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
      }
    };

    this.socket.onerror = (event) => { // Use browser's Event
      console.error('WebSocket Error:', event);
      this.options.onError({ code: 'WEBSOCKET_ERROR', message: 'Real-time connection error.' });
      this.disconnectWebSocket(); 
    };

    this.socket.onclose = (event) => { // Use browser's CloseEvent
      console.log(`WebSocket Disconnected: code=${event.code}, reason=${event.reason}, wasClean=${event.wasClean}`);
      // Only trigger error on unclean close *if* not already success/error
      // Needs more robust state management if you want to differentiate
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
    
    if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        console.log('Disconnecting WebSocket...');
        this.socket.close();
    }
    this.socket = null;
  }
}