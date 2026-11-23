import { describe, it, expect, afterEach } from 'vitest';
import './payment-modal.js';
import type { PaymentModal } from './payment-modal.js';

// The test DOM has <dialog> without showModal/close.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };

// When the catalog can't be loaded (timeout, host down), the first step says
// so and offers a retry, instead of an empty list with no way out.
describe('smartpay-payment-modal: catalog that failed to load', () => {
  let el: PaymentModal;

  afterEach(() => el?.remove());

  async function mount(props: Partial<PaymentModal>) {
    el = document.createElement('smartpay-payment-modal') as PaymentModal;
    Object.assign(el, { isOpen: true, ...props });
    document.body.appendChild(el);
    await el.updateComplete;
    return el.shadowRoot!;
  }

  it('shows the error and a retry that asks the button to load again', async () => {
    const root = await mount({ isLoadingData: false, assets: [] });

    expect(root.textContent).toContain('No se pudo cargar los datos de pago.');
    const retry = [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Reintentar');
    expect(retry).toBeDefined();

    let asked = 0;
    el.addEventListener('retryLoad', () => asked++);
    retry!.click();
    expect(asked).toBe(1);
  });

  it('shows no retry while the catalog is still loading', async () => {
    const root = await mount({ isLoadingData: true, assets: [] });

    const retry = [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Reintentar');
    expect(retry).toBeUndefined();
  });
});
