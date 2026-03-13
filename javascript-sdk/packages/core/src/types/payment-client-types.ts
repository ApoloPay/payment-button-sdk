import { ClientError, ClientResponse } from "./client-response";

// Detalles que necesitamos para obtener el QR
export interface QrRequestDetails {
  assetId: string;
  networkId: string;
}

// Lo que esperamos recibir para mostrar el QR
export interface QrResponseData {
  id: string,
  network: string,
  asset: string,
  amount: number | string,
  address: string,
  qrCodeUrl: string; // URL de la imagen del QR (o los datos para generarla)
  expiresAtMs: number; // Fecha exacta de expiración (ISO String o Timestamp)
  paymentUrl?: string; // URL opcional para pagar directamente desde el dispositivo
}

export interface PaymentResponseData {
  id: string,
  network: string,
  asset: string,
  amount: number | string,
  status: string;
}

export interface PartialPaymentResponseData {
  id: string,
  network: string,
  asset: string,
  amount: number | string,
  amountPaid: number | string,
  status: string;
}

export interface ClientOptions {
  publicKey: string;
}

export interface PaymentSessionOptions {
  processId: string;
  onSuccess?: (response: ClientResponse<PaymentResponseData>) => void;
  onPartialPayment?: (response: ClientResponse<PartialPaymentResponseData>) => void;
  onError?: (error: ClientError) => void;
}

export interface PaymentOptions extends ClientOptions, PaymentSessionOptions { }
