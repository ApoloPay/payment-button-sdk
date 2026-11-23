export interface SmartPayClientOptions {
  publicKey: string;
}

export class SmartPayClient {
  private publicKey: string;

  constructor(options: SmartPayClientOptions) {
    this.publicKey = options.publicKey;
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public isSandbox(): boolean {
    return this.publicKey.startsWith('pk_test');
  }
}

/** @deprecated Use `SmartPayClient` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export const ApoloPayClient = SmartPayClient;
/** @deprecated Use `SmartPayClient` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export type ApoloPayClient = SmartPayClient;
/** @deprecated Use `SmartPayClientOptions` instead. Pre-2.0 (`@apolopay-sdk/core`) name, kept for backwards compatibility. */
export type ApoloPayClientOptions = SmartPayClientOptions;
