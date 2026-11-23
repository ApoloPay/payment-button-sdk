import { describe, it, expect } from 'vitest';
import { SmartPayClient, ApoloPayClient } from './smart-pay-client';

describe('SmartPayClient', () => {
  it('detects sandbox keys', () => {
    expect(new SmartPayClient({ publicKey: 'pk_test_abc' }).isSandbox()).toBe(true);
    expect(new SmartPayClient({ publicKey: 'pk_live_abc' }).isSandbox()).toBe(false);
  });

  it('keeps the deprecated ApoloPayClient alias pointing to the same class', () => {
    expect(ApoloPayClient).toBe(SmartPayClient);
    expect(new ApoloPayClient({ publicKey: 'pk_test_abc' })).toBeInstanceOf(SmartPayClient);
  });
});
