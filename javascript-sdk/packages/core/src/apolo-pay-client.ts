export interface ApoloPayClientOptions {
  publicKey: string;
}

export class ApoloPayClient {
  private publicKey: string;

  constructor(options: ApoloPayClientOptions) {
    this.publicKey = options.publicKey;
  }

  public getPublicKey(): string {
    return this.publicKey;
  }
}
