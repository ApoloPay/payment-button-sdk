export abstract class ClientResponseBase {
  readonly code: string;
  readonly message: string;

  constructor({ code, message }: { code: string, message: string }) {
    this.code = code;
    this.message = message;
  }
}

export class ClientResponse<T = any> extends ClientResponseBase {
  readonly result?: T;

  constructor({ code, message, result }: { code: string, message: string, result?: T }) {
    super({ code, message });
    this.result = result;
  }

  static fromJson<T = any>(json: any, { code, message, result }: {
    code?: string,
    message?: string,
    result?: (json: any) => T
  } = {}): ClientResponse<T> {
    const successCode = json.status || code || 'success';
    const successMessage = json.message || message || 'Success';
    const successResult = result?.(json.result) || json.result || json;

    return new ClientResponse<T>({ code: successCode, message: successMessage, result: successResult });
  }
}

export class ClientError extends ClientResponseBase {
  readonly error?: any;

  constructor({ code, message, error }: { code: string, message: string, error?: any }) {
    super({ code, message });
    this.error = error;
  }

  static fromError(error: any, { code, message }: { code?: string, message?: string } = {}): ClientError {
    const errCode = error.statusCode || code || 'unknown_error';
    const errMessage = error.message || message || 'Error desconocido';
    const err = error.error || error;

    return new ClientError({ code: errCode, message: errMessage, error: err });
  }
}