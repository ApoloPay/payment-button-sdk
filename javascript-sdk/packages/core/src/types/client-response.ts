import { I18n } from "../i18n";

export enum ClientCode {
  success = 'success',
  payment_success = 'payment_success',
  payment_failed = 'payment_failed',
  payment_partial = 'payment_partial',
  payment_timeout = 'payment_timeout',
  connect_error = 'connect_error',
  socket_connection_error = 'socket_connection_error',
  data_load_error = 'data_load_error',
  qr_fetch_error = 'qr_fetch_error',
  paymentProcessNotAvailable = 'payment_process_not_available',
  get_assets_error = 'get_assets_error',
  unknown_error = 'unknown_error'
}

export abstract class ClientResponseBase {
  readonly code: ClientCode;
  readonly message: string;

  constructor({ code, message }: { code: ClientCode, message: string }) {
    this.code = code;
    this.message = message;
  }
}

export class ClientResponse<T = any> extends ClientResponseBase {
  readonly result?: T;

  constructor({ code, message, result }: { code: ClientCode, message: string, result?: T }) {
    super({ code, message });
    this.result = result;
  }

  static fromJson<T = any>(json: any, { code, message, result }: {
    code?: ClientCode,
    message?: string,
    result?: (json: any) => T
  } = {}): ClientResponse<T> {
    const successCode = json.status || code || ClientCode.success;
    const successMessage = json.message || message || I18n.t.successes.success;
    const successResult = result?.(json.result) || json.result || json;

    return new ClientResponse<T>({ code: successCode, message: successMessage, result: successResult });
  }
}

export class ClientError extends ClientResponseBase {
  readonly error?: any;

  constructor({ code, message, error }: { code: ClientCode, message: string, error?: any }) {
    super({ code, message });
    this.error = error;
  }

  static fromError(error: any, { code, message }: { code?: ClientCode, message?: string } = {}): ClientError {
    if (error instanceof ClientError) return error;

    const errCode = code || error.statusCode || ClientCode.unknown_error;
    const errMessage = message || error.message || I18n.t.errors.unknownError;
    const err = error.error || error;

    return new ClientError({ code: errCode, message: errMessage, error: err });
  }
}