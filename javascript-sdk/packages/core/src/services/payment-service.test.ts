import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApoloPayClient } from '../apolo-pay-client';
import { sandboxFallbackAssets } from './sandbox-data';

const mockSocketConnect = vi.fn();
const mockSocketDisconnect = vi.fn();

vi.mock('./socket-service', () => ({
  SocketService: class {
    connect = mockSocketConnect;
    disconnect = mockSocketDisconnect;
  },
}));

// Imported after the mock so PaymentService picks up the mocked SocketService.
const { PaymentService } = await import('./payment-service');

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('PaymentService', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    mockSocketConnect.mockClear();
    mockSocketDisconnect.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('sandbox mode', () => {
    it('getAssets still fetches the real (public) catalog, to reuse its real icons', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({
        status: 'success',
        message: 'ok',
        result: [{ id: 'a1', name: 'USDT', symbol: 'USDT', image: 'https://real/icon.png', networks: [] }],
      }));

      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_test_x' }));
      const assets = await service.getAssets();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(assets[0].image).toBe('https://real/icon.png');
    });

    it('getAssets falls back to sandboxFallbackAssets when the catalog fetch fails', async () => {
      fetchMock.mockRejectedValueOnce(new Error('network down'));

      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_test_x' }));
      const assets = await service.getAssets();

      expect(assets).toBe(sandboxFallbackAssets);
    });

    it('fetchQrCodeDetails never touches the real backend or socket', async () => {
      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_test_x' }));
      const asset = sandboxFallbackAssets[0];
      const network = asset.networks[0];

      const qr = await service.fetchQrCodeDetails(
        { assetId: asset.id, networkId: network.id },
        { processId: 'proc-1' }
      );

      expect(fetchMock).not.toHaveBeenCalled();
      expect(mockSocketConnect).not.toHaveBeenCalled();
      expect(qr.address).toContain('sandbox-');
      expect(qr.amountPaid).toBe(0);
    });

    it('fetchQrCodeDetails falls back to the first asset/network for unknown ids', async () => {
      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_test_x' }));

      const qr = await service.fetchQrCodeDetails(
        { assetId: 'unknown', networkId: 'unknown' },
        { processId: 'proc-1' }
      );

      expect(qr.asset).toBe(sandboxFallbackAssets[0].symbol);
    });
  });

  describe('real (non-sandbox) mode', () => {
    it('getAssets hits the real catalog endpoint', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ status: 'success', message: 'ok', result: [] }));

      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_live_x' }));
      await service.getAssets();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('fetchQrCodeDetails hits the real backend and connects the socket', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({
        status: 'success',
        message: 'ok',
        result: { id: 'proc-1', network: 'apolopay', wallet: '0xabc' },
      }));

      const service = new PaymentService(new ApoloPayClient({ publicKey: 'pk_live_x' }));
      const qr = await service.fetchQrCodeDetails(
        { assetId: 'a1', networkId: 'n1' },
        { processId: 'proc-1' }
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(mockSocketConnect).toHaveBeenCalledTimes(1);
      expect(qr.address).toContain('proc-1');
    });
  });
});
