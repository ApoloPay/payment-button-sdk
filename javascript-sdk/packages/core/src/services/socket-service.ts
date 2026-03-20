import { io, Socket as SocketIO } from "socket.io-client";
import { PaymentSessionOptions } from "../types/payment-client-types";
import { ApoloPayClient } from "../apolo-pay-client";
import { socketURL } from "../utils/variables";
import { ClientCode } from "../types/client-response";
import { I18n } from "../i18n";

interface _SocketResponse<T = any> {
  success: boolean,
  event: 'funds_received' | 'partial_payment',
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
      this.sessionOptions?.onError?.({ code: ClientCode.connect_error, message: I18n.t.errors.connectError, error });
      this.disconnect();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.info(`Socket.io Desconectado: ${reason}`);
      this.socket = null;
    });
  }

  private handleWebSocketMessage(response: _SocketResponse): void {
    if (!response.success) {
      return this.sessionOptions?.onError?.({
        code: ClientCode.payment_failed,
        message: response.message,
        error: response.result
      });
    }

    if (response.event === 'partial_payment') {
      return this.sessionOptions?.onPartialPayment?.({
        code: ClientCode.payment_partial,
        message: response.message,
        result: response.result
      });
    }

    if (response.event === 'funds_received') {
      return this.sessionOptions?.onSuccess?.({
        code: ClientCode.payment_success,
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