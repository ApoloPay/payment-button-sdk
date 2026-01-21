import { io, Socket as SocketIO } from "socket.io-client";
import { PaymentOptions } from "./types/payment-client-types";
import { SocketResponse } from "./types/api-response";

export class Socket {
  static wsUrl = "https://pb-test-ws.apolopay.app"

  private options: PaymentOptions;
  private socket: SocketIO | null = null;

  constructor(options: PaymentOptions) {
    this.options = options;
  }

  public connectWebSocket(processId: string): void {
    if (typeof window === 'undefined') return;

    if (this.socket && this.socket.connected) {
      console.log('Socket.io ya conectado.');
      return;
    }

    console.log(`Conectando a Socket.io para processId: ${processId}...`);

    this.socket = io(Socket.wsUrl, {
      extraHeaders: {
        "x-public-key": this.options.publicKey
      },
      transports: ['polling']
    });

    this.socket.on('connect', () => this.socket?.emit('process:connect', { processId }));

    this.socket.on('process:message', (message: SocketResponse) => this.handleWebSocketMessage(message));

    this.socket.on('connect_error', (error) => {
      console.error('Error en conexión Socket.io:', error);
      this.options.onError({ success: false, event: 'connect_error', message: 'Error de conexión en tiempo real.', result: error });
      this.disconnectWebSocket();
    });

    this.socket.on('disconnect', (reason) => {
      console.info(`Socket.io Desconectado: ${reason}`);
      this.socket = null;
      this.options.onError({ success: false, event: 'disconnect', message: 'Error de desconexión en tiempo real.', result: reason });
    });
  }

  private handleWebSocketMessage(message: SocketResponse): void {
    console.log(message);

    if (!message.success) return this.options.onError(message);

    if (message.result.status === 'success') return this.options.onSuccess(message);
  }

  public disconnectWebSocket(): void {
    if (this.socket) {
      console.info('Disconnecting Socket.io...');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}