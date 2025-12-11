// Detalles que necesitamos para obtener el QR
export interface QrRequestDetails {
  assetId: string;
  networkId: string;
}

// Lo que esperamos recibir para mostrar el QR
export interface QrResponseData {
  paymentId: string; // ID único para esta transacción (para el WebSocket)
  address: string;   // La dirección a la que enviar los fondos
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
  apiKey: string;
  amount: number;
  email: string;
  onSuccess: (response: PaymentResponse) => void;
  onError: (error: PaymentError) => void;
}