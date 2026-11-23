import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SmartPayClient } from '../smart-pay-client';
import { PaymentService } from './payment-service';
import { Repository, REQUEST_TIMEOUT_MS } from './repository';
import { sandboxFallbackAssets } from './sandbox-data';
import { ClientCode } from '../types/client-response';
import { generateQrCodeDataUri } from '../utils/qr-code';

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Repository base URL', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getAssets hits the given base URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ status: 'success', message: 'ok', result: [] }));

    await Repository.getAssets('https://sandbox-api.smartpaylatam.com');

    expect(fetchMock.mock.calls[0][0]).toBe('https://sandbox-api.smartpaylatam.com/payment-button/assets');
  });

  it('fetchQrCodeDetails hits the given base URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      status: 'success',
      message: 'ok',
      result: { id: 'q1', wallet: '0xabc', network: 'tron', asset: 'USDT', amount: 1 },
    }));

    await Repository.fetchQrCodeDetails('https://sandbox-api.smartpaylatam.com', {
      processId: 'proc-1',
      assetId: 'a1',
      networkId: 'n1',
      publicKey: 'pk_live',
    });

    expect(fetchMock.mock.calls[0][0]).toBe('https://sandbox-api.smartpaylatam.com/payment-button/process/confirm');
  });

  it('PaymentService passes the client apiUrl through (default and override)', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ status: 'success', message: 'ok', result: [] }));

    await new PaymentService(new SmartPayClient({ publicKey: 'pk_test_x' })).getAssets();
    await new PaymentService(
      new SmartPayClient({ publicKey: 'pk_test_x', apiUrl: 'https://testing.smartpaylatam.com/' })
    ).getAssets();

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.smartpaylatam.com/payment-button/assets');
    expect(fetchMock.mock.calls[1][0]).toBe('https://testing.smartpaylatam.com/payment-button/assets');
  });
});

describe('Repository QR code', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchQrCodeDetails builds the QR locally from the wallet address (no third-party URL)', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse({
      status: 'success',
      message: 'ok',
      result: { id: 'q1', wallet: '0xabc', network: 'tron', asset: 'USDT', amount: 1 },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await Repository.fetchQrCodeDetails('https://api.example.com', {
      processId: 'proc-1',
      assetId: 'a1',
      networkId: 'n1',
      publicKey: 'pk_live',
    });

    expect(response.result!.address).toBe('0xabc');
    expect(response.result!.qrCodeUrl).toBe(generateQrCodeDataUri('0xabc'));
    expect(response.result!.qrCodeUrl.startsWith('data:image/svg+xml')).toBe(true);
    // Only the backend was contacted.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('Repository request timeout', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  /** A fetch that never answers on its own and only rejects when its signal aborts. */
  function hangingFetch(_url: string, init: RequestInit) {
    return new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener('abort', () => {
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      });
    });
  }

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn(hangingFetch);
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('getAssets aborts after REQUEST_TIMEOUT_MS and surfaces get_assets_error', async () => {
    const promise = Repository.getAssets('https://unreachable.example.com');
    const assertion = expect(promise).rejects.toMatchObject({ code: ClientCode.get_assets_error });

    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal!.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await assertion;
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal!.aborted).toBe(true);
  });

  it('fetchQrCodeDetails aborts after REQUEST_TIMEOUT_MS and surfaces qr_fetch_error', async () => {
    const promise = Repository.fetchQrCodeDetails('https://unreachable.example.com', {
      processId: 'proc-1',
      assetId: 'a1',
      networkId: 'n1',
      publicKey: 'pk_live',
    });
    const assertion = expect(promise).rejects.toMatchObject({ code: ClientCode.qr_fetch_error });

    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    await assertion;
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal!.aborted).toBe(true);
  });

  it('sandbox getAssets falls back to the sandbox catalog as soon as the timeout fires', async () => {
    const service = new PaymentService(new SmartPayClient({ publicKey: 'pk_test_x' }));
    const promise = service.getAssets();

    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);

    await expect(promise).resolves.toEqual(sandboxFallbackAssets);
  });
});
