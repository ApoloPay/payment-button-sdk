import { describe, it, expect } from 'vitest';
import { sandboxFallbackAssets, buildSandboxQrData } from './sandbox-data';
import { isApoloPayNetwork } from '../types/network';

describe('sandboxFallbackAssets', () => {
  it('exposes one asset with apolopay + near + ethereum networks', () => {
    expect(sandboxFallbackAssets).toHaveLength(1);

    const asset = sandboxFallbackAssets[0];
    expect(asset.symbol).toBe('USDT');
    expect(asset.networks.map(n => n.network)).toEqual(
      expect.arrayContaining(['apolopay', 'near', 'ethereum'])
    );
    expect(asset.networks.filter(isApoloPayNetwork)).toHaveLength(1);
  });
});

describe('buildSandboxQrData', () => {
  const asset = sandboxFallbackAssets[0];

  it('builds a process-scoped address for the apolopay network', () => {
    const apolopayNetwork = asset.networks.find(isApoloPayNetwork)!;

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
