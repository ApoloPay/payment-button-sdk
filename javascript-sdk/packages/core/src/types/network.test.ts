import { describe, it, expect } from 'vitest';
import { APOLOPAY_NETWORK_ID, isApoloPayNetwork, type Network } from './network';

describe('isApoloPayNetwork', () => {
  it('is true only for the apolopay network id', () => {
    const apolopay: Network = { id: '1', name: 'Apolo Pay', network: 'apolopay', image: '', isNative: true };
    const near: Network = { id: '2', name: 'NEAR', network: 'near', image: '', isNative: false };

    expect(isApoloPayNetwork(apolopay)).toBe(true);
    expect(isApoloPayNetwork(near)).toBe(false);
    expect(APOLOPAY_NETWORK_ID).toBe('apolopay');
  });

  it('accepts any object with a matching network field, not just a full Network', () => {
    expect(isApoloPayNetwork({ network: 'apolopay' })).toBe(true);
    expect(isApoloPayNetwork({ network: 'ethereum' })).toBe(false);
  });
});
