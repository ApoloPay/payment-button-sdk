import { Asset } from "../types/asset";
import { Network, APOLOPAY_NETWORK_ID, isApoloPayNetwork } from "../types/network";
import { QrResponseData } from "../types/payment-client-types";

// Only used when the real asset catalog can't be fetched (e.g. offline demo).
export const sandboxFallbackAssets: Asset[] = [
  {
    id: 'sandbox-usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    image: '',
    networks: [
      { id: 'sandbox-apolopay', name: 'Apolo Pay', network: APOLOPAY_NETWORK_ID, image: '', isNative: true },
      { id: 'sandbox-near', name: 'NEAR', network: 'near', image: '', isNative: false },
      { id: 'sandbox-ethereum', name: 'Ethereum', network: 'ethereum', image: '', isNative: false },
    ],
  },
];

export function buildSandboxQrData({
  processId,
  asset,
  network,
}: {
  processId: string;
  asset: Asset;
  network: Network;
}): QrResponseData {
  const now = Date.now();
  const address = isApoloPayNetwork(network)
    ? `sandbox-process-${processId}`
    : `sandbox-${network.network}-0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d`;

  return {
    id: processId,
    network: network.network,
    asset: asset.symbol,
    amount: 103.75,
    amountPaid: 0,
    address,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(address)}&ecc=H`,
    expiresAtMs: now + 10 * 60 * 1000,
    paymentUrl: undefined,
  };
}
