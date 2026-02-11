import { io, Socket as SocketIO } from "socket.io-client";
import { PaymentSessionOptions } from "../types/payment-client-types";
import { ApoloPayClient } from "../apolo-pay-client";
import { socketURL } from "../utils/variables";

interface _SocketResponse<T = any> {
  success: boolean,
  event: string,
  message: string,
  result: T
}

export class SocketService {
  private client: ApoloPayClient;
  private sessionOptions: PaymentSessionOptions | null = null;
  private socket: SocketIO | null = null;

  constructor(client: ApoloPayClient) {
    this.client = client;
  }

  public connect(session: PaymentSessionOptions): void {
    if (typeof window === 'undefined') return;

    this.sessionOptions = session;

    if (this.socket && this.socket.connected) return this.disconnect();

    this.socket = io(socketURL, {
      extraHeaders: {
        "x-public-key": this.client.getPublicKey()
      },
      transports: ['polling']
    });

    const { processId } = session;
    this.socket.on('connect', () => this.socket?.emit('process:connect', { processId }));

    console.log(`Conectado a Socket.io para processId: ${processId}`);

    this.socket.on('process:message', (response: _SocketResponse) => this.handleWebSocketMessage(response));

    this.socket.on('connect_error', (error: Error) => {
      console.error('Error en conexión Socket.io:', error);
      this.sessionOptions?.onError({ code: 'connect_error', message: 'Error de conexión en tiempo real.', error });
      this.disconnect();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.info(`Socket.io Desconectado: ${reason}`);
      this.socket = null;
    });
  }

  private handleWebSocketMessage(response: _SocketResponse): void {
    console.log(response);

    if (!response.success) {
      return this.sessionOptions?.onError({
        code: 'payment_failed',
        message: response.message,
        error: response.result
      });
    }

    if (response.result.status === 'completed') {
      return this.sessionOptions?.onSuccess({
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