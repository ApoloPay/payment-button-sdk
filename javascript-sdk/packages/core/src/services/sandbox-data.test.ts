import { describe, it, expect } from 'vitest';
import { sandboxFallbackAssets, buildSandboxQrData } from './sandbox-data';
import { isApoloPayNetwork, withoutApoloPayNetworks, APOLOPAY_NETWORK_ID } from '../types/network';

describe('sandboxFallbackAssets', () => {
  it('exposes one asset with near + ethereum networks, never apolopay', () => {
    expect(sandboxFallbackAssets).toHaveLength(1);

    const asset = sandboxFallbackAssets[0];
    expect(asset.symbol).toBe('USDT');
    expect(asset.networks.map(n => n.network)).toEqual(['near', 'ethereum']);
    expect(asset.networks.filter(isApoloPayNetwork)).toHaveLength(0);
  });
});

describe('withoutApoloPayNetworks', () => {
  const apolo = { id: 'n-apolo', name: 'Apolo Pay', network: 'APOLOPAY', image: '', isNative: true };
  const eth = { id: 'n-eth', name: 'Ethereum', network: 'ethereum', image: '', isNative: false };

  it('drops the apolopay network, and an asset left without networks', () => {
    const result = withoutApoloPayNetworks([
      { id: 'usdt', networks: [apolo, eth] },
      { id: 'only-apolo', networks: [apolo] },
    ]);

    expect(result.map(a => a.id)).toEqual(['usdt']);
    expect(result[0].networks).toEqual([eth]);
  });
});

describe('buildSandboxQrData', () => {
  const asset = sandboxFallbackAssets[0];

  it('builds a process-scoped address for the apolopay network', () => {
    // Never offered anymore (filtered out), but the builder still handles it.
    const apolopayNetwork = { id: 'sandbox-apolopay', name: 'Apolo Pay', network: APOLOPAY_NETWORK_ID, image: '', isNative: true };

    const qr = buildSandboxQrData({ processId: 'proc-123', asset, network: apolopayNetwork });

    expect(qr.address).toBe('sandbox-process-proc-123');
    expect(qr.qrCodeUrl).toContain(encodeURIComponent(qr.address));
    expect(qr.network).toBe('apolopay');
    expect(qr.asset).toBe('USDT');
    expect(qr.amount).toBe(103.75);
    expect(qr.amountPaid).toBe(0);
    expect(qr.paymentUrl).toBeUndefined();
  });

  it('builds a network-scoped fake wallet address for external networks', () => {
    const near = asset.networks.find(n => n.network === 'near')!;

    const qr = buildSandboxQrData({ processId: 'proc-123', asset, network: near });

    expect(qr.address.startsWith('sandbox-near-0x')).toBe(true);
    expect(qr.network).toBe('near');
  });

  it('sets an expiry roughly 10 minutes in the future', () => {
    const before = Date.now();
    const qr = buildSandboxQrData({ processId: 'proc-123', asset, network: asset.networks[0] });

    expect(qr.expiresAtMs).toBeGreaterThanOrEqual(before + 10 * 60 * 1000 - 1000);
    expect(qr.expiresAtMs).toBeLessThanOrEqual(before + 10 * 60 * 1000 + 1000);
  });
});
