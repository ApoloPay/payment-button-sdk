import { io, Socket as SocketIO } from "socket.io-client";
import { PaymentOptions } from "../types/payment-client-types";

interface _SocketResponse<T = any> {
  success: boolean,
  event: string,
  message: string,
  result: T
}

export class SocketService {
  static wsUrl = "https://pb-test-ws.apolopay.app"

  private options: PaymentOptions;
  private socket: SocketIO | null = null;

  constructor(options: PaymentOptions) {
    this.options = options;
  }

  public connect(processId: string): void {
    if (typeof window === 'undefined') return;

    if (this.socket && this.socket.connected) return this.disconnect()

    this.socket = io(SocketService.wsUrl, {
      extraHeaders: {
        "x-public-key": this.options.publicKey
      },
      transports: ['polling']
    });

    this.socket.on('connect', () => this.socket?.emit('process:connect', { processId }));

    console.log(`Conectado a Socket.io para processId: ${processId}`);

    this.socket.on('process:message', (response: _SocketResponse) => this.handleWebSocketMessage(response));

    this.socket.on('connect_error', (error) => {
      console.error('Error en conexión Socket.io:', error);
      this.options.onError({ code: 'connect_error', message: 'Error de conexión en tiempo real.', error });
      this.disconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.info(`Socket.io Desconectado: ${reason}`);
      this.socket = null;
    });
  }

  private handleWebSocketMessage(response: _SocketResponse): void {
    console.log(response);

    if (!response.success) {
      return this.options.onError({
        code: 'payment_failed',
        message: response.message,
        error: response.result
      });
    }

    if (response.result.status === 'completed') {
      return this.options.onSuccess({
        code: 'payment_success',
        message: response.message,
        result: response.result
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}