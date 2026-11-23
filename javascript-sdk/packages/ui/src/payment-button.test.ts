import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SmartPayClient, ApoloPayClient } from '@nexora-smartpay/core';
import { SmartPayButton, ApoloPayButton } from './payment-button.js';

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Regression tests for a bug where a stale simulated partial-payment result
// (amount/amountPaid) survived into the next QR/process instead of resetting.
describe('SmartPayButton state reset', () => {
  let el: SmartPayButton;

  beforeEach(() => {
    // getAssets() fetches the (public) real catalog even in sandbox mode —
    // stub it so no test ever makes a real network call.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'success', message: 'ok', result: [] })));
    el = document.createElement('smartpay-button') as SmartPayButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    vi.unstubAllGlobals();
  });

  it('resets amountPaid to the fresh QR value (0) instead of keeping a stale one', async () => {
    el.client = new SmartPayClient({ publicKey: 'pk_test_unit' });
    el.processId = 'proc-1';
    await el.updateComplete;

    // Simulate leftover state from a previously simulated partial payment.
    (el as any).selectedAsset = 'sandbox-usdt';
    (el as any).amount = 103.75;
    (el as any).amountPaid = 41.5;

    await (el as any).handleInitiatePayment(new CustomEvent('networkSelect', {
      detail: { network: { id: 'sandbox-apolopay', network: 'apolopay', name: 'Apolo Pay', image: '', isNative: true } },
    }));

    // The sandbox mock QR always reports amountPaid: 0 — before the fix,
    // `if (qrData.amountPaid)` was falsy for 0 and silently kept the stale 41.5.
    expect((el as any).amountPaid).toBe(0);
    expect((el as any).amount).toBe(103.75);
  });

  it('resetState clears amount/amountPaid along with the rest of the session', () => {
    el.client = new SmartPayClient({ publicKey: 'pk_test_unit' });
    (el as any).amount = 50;
    (el as any).amountPaid = 20;
    (el as any).successResult = { code: 'payment_partial' };

    (el as any).resetState();

    expect((el as any).amount).toBe(0);
    expect((el as any).amountPaid).toBeUndefined();
    expect((el as any).successResult).toBeNull();
  });

  it('clears the previous session state when a new processId is assigned', async () => {
    el.client = new SmartPayClient({ publicKey: 'pk_test_unit' });
    el.processId = 'proc-1';
    await el.updateComplete;

    (el as any).amount = 103.75;
    (el as any).amountPaid = 41.5;
    (el as any).successResult = { code: 'payment_partial' };

    el.processId = 'proc-2';
    await el.updateComplete;

    expect((el as any).amount).toBe(0);
    expect((el as any).amountPaid).toBeUndefined();
    expect((el as any).successResult).toBeNull();
  });
});

// Regression tests mirroring dart_sdk's smartpay_button_test.dart — the two
// SDKs must agree on which public keys are accepted, or one platform's
// "sandbox mode works" silently breaks on the other.
describe('SmartPayButton config validation', () => {
  let el: SmartPayButton;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'success', message: 'ok', result: [] })));
    el = document.createElement('smartpay-button') as SmartPayButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    vi.unstubAllGlobals();
  });

  it('accepts a sandbox key regardless of its length', async () => {
    el.client = new SmartPayClient({ publicKey: 'pk_test_c6649e69315edc3389a3cc439e7b0649' });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(false);
  });

  it('accepts a valid 35-char live key', async () => {
    el.client = new SmartPayClient({ publicKey: `pk_${'a'.repeat(32)}` });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(false);
  });

  it('rejects a live key with the wrong length', async () => {
    el.client = new SmartPayClient({ publicKey: 'pk_too_short' });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(true);
  });
});

// The pre-rename tag/class/client names must keep working for existing merchants.
describe('deprecated apolopay aliases', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'success', message: 'ok', result: [] })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('registers both <smartpay-button> and the legacy <apolopay-button>', () => {
    expect(customElements.get('smartpay-button')).toBe(SmartPayButton);
    expect(customElements.get('apolopay-button')).toBe(ApoloPayButton);
  });

  it('legacy <apolopay-button> behaves like <smartpay-button> and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const first = document.createElement('apolopay-button');
    const second = document.createElement('apolopay-button');
    expect(first).toBeInstanceOf(SmartPayButton);

    document.body.append(first, second);
    first.client = new ApoloPayClient({ publicKey: 'pk_test_c6649e69315edc3389a3cc439e7b0649' });
    await first.updateComplete;

    expect((first as any).hasConfigError).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);

    first.remove();
    second.remove();
  });
});
