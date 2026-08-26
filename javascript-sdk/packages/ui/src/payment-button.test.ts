import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApoloPayClient } from '@apolopay-sdk/core';
import './payment-button.js';
import type { ApoloPayButton } from './payment-button.js';

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Regression tests for a bug where a stale simulated partial-payment result
// (amount/amountPaid) survived into the next QR/process instead of resetting.
describe('ApoloPayButton state reset', () => {
  let el: ApoloPayButton;

  beforeEach(() => {
    // getAssets() fetches the (public) real catalog even in sandbox mode —
    // stub it so no test ever makes a real network call.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'success', message: 'ok', result: [] })));
    el = document.createElement('apolopay-button') as ApoloPayButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    vi.unstubAllGlobals();
  });

  it('resets amountPaid to the fresh QR value (0) instead of keeping a stale one', async () => {
    el.client = new ApoloPayClient({ publicKey: 'pk_test_unit' });
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
    el.client = new ApoloPayClient({ publicKey: 'pk_test_unit' });
    (el as any).amount = 50;
    (el as any).amountPaid = 20;
    (el as any).successResult = { code: 'payment_partial' };

    (el as any).resetState();

    expect((el as any).amount).toBe(0);
    expect((el as any).amountPaid).toBeUndefined();
    expect((el as any).successResult).toBeNull();
  });

  it('clears the previous session state when a new processId is assigned', async () => {
    el.client = new ApoloPayClient({ publicKey: 'pk_test_unit' });
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

// Regression tests mirroring dart_sdk's apolopay_button_test.dart — the two
// SDKs must agree on which public keys are accepted, or one platform's
// "sandbox mode works" silently breaks on the other.
describe('ApoloPayButton config validation', () => {
  let el: ApoloPayButton;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'success', message: 'ok', result: [] })));
    el = document.createElement('apolopay-button') as ApoloPayButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    vi.unstubAllGlobals();
  });

  it('accepts a sandbox key regardless of its length', async () => {
    el.client = new ApoloPayClient({ publicKey: 'pk_test_c6649e69315edc3389a3cc439e7b0649' });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(false);
  });

  it('accepts a valid 35-char live key', async () => {
    el.client = new ApoloPayClient({ publicKey: `pk_${'a'.repeat(32)}` });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(false);
  });

  it('rejects a live key with the wrong length', async () => {
    el.client = new ApoloPayClient({ publicKey: 'pk_too_short' });
    await el.updateComplete;

    expect((el as any).hasConfigError).toBe(true);
  });
});
