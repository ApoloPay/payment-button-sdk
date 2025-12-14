// Detalles que necesitamos para obtener el QR
export interface QrRequestDetails {
  assetId: string;
  networkId: string;
}

// Lo que esperamos recibir para mostrar el QR
export interface QrResponseData {
  network: string,
  asset: string,
  amount: number | string,
  metadata?: Record<string, any>,
  address: string,
  qrCodeUrl: string; // URL de la imagen del QR (o los datos para generarla)
  expiresAt: string; // Fecha exacta de expiración (ISO String o Timestamp)
}


// Tipos para WebSocket (Ejemplo)
export interface WebSocketMessage {
  type: 'paymentConfirmation' | 'paymentError' | 'pending';
  data: any; // El payload dependerá de tu backend
}

// --- Interfaces de Respuesta ---
export interface PaymentResponse {
  transactionId: string;
  status: 'success';
}
export interface PaymentError {
  code: string;
  message: string;
}

export interface PaymentOptions {
  publicKey: string;
  amount: number;
  metadata?: Record<string, any>;
  onSuccess: (response: PaymentResponse) => void;
  onError: (error: PaymentError) => void;
}