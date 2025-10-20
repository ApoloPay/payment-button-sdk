// Estos son los tipos que todos los paquetes compartirán
export interface PaymentOptions {
  apiKey: string;
  amount: number;
  currency: string;
  onSuccess: (response: PaymentResponse) => void;
  onError: (error: PaymentError) => void;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success';
}

export interface PaymentError {
  code: string;
  message: string;
}

// Esta es la lógica central
export class PaymentClient {
  private options: PaymentOptions;

  constructor(options: PaymentOptions) {
    this.options = options;
    console.log('PaymentClient inicializado');
  }

  public async initiatePayment() {
    console.log(`Iniciando pago de ${this.options.amount} ${this.options.currency} con API Key ${this.options.apiKey}`);

    // Simulación de llamada a tu backend
    try {
      // const response = await fetch('https://api.tuplataforma.com/pay', { ... });
      // const data = await response.json();

      // Simulación exitosa
      setTimeout(() => {
        const mockResponse: PaymentResponse = {
          transactionId: 'txn_12345abc',
          status: 'success',
        };
        this.options.onSuccess(mockResponse);
      }, 1000);

    } catch (e) {
      // Simulación de error
      const mockError: PaymentError = {
        code: 'API_ERROR',
        message: 'No se pudo conectar al servidor',
      };
      this.options.onError(mockError);
    }
  }
}