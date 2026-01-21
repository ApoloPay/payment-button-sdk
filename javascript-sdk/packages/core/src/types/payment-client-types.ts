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
  metadata?: Record<string, any>,
  address: string,
  qrCodeUrl: string; // URL de la imagen del QR (o los datos para generarla)
  expiresAtMs: number; // Fecha exacta de expiración (ISO String o Timestamp)
}

export interface PaymentOptions {
  publicKey: string;
  amount: number;
  metadata?: Record<string, any>;
  onSuccess: (response: ClientResponse) => void;
  onError: (error: ClientError) => void;
}
