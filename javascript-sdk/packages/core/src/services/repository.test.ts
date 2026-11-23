import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SmartPayClient } from '../smart-pay-client';
import { PaymentService } from './payment-service';
import { Repository } from './repository';

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

    await Repository.getAssets('https://api.example.com');

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/payment-button/assets');
  });

  it('fetchQrCodeDetails hits the given base URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      status: 'success',
      message: 'ok',
      result: { id: 'q1', wallet: '0xabc', network: 'tron', asset: 'USDT', amount: 1 },
    }));

    await Repository.fetchQrCodeDetails('https://api.example.com', {
      processId: 'proc-1',
      assetId: 'a1',
      networkId: 'n1',
      publicKey: 'pk_live',
    });

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/payment-button/process/confirm');
  });

  it('PaymentService passes the client apiUrl through (default and override)', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ status: 'success', message: 'ok', result: [] }));

    await new PaymentService(new SmartPayClient({ publicKey: 'pk_test_x' })).getAssets();
    await new PaymentService(
      new SmartPayClient({ publicKey: 'pk_test_x', apiUrl: 'https://custom.example.com/' })
    ).getAssets();

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.smartpaylatam.com/payment-button/assets');
    expect(fetchMock.mock.calls[1][0]).toBe('https://custom.example.com/payment-button/assets');
  });
});
