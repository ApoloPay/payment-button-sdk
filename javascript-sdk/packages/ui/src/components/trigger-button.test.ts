import { describe, it, expect, afterEach } from 'vitest';
import './trigger-button.js';
import type { TriggerButton } from './trigger-button.js';

// Nexora visual identity: the trigger shows Nexora's label and vector mark,
// nothing of the old Apolo branding (label, base64 PNG logo).
describe('smartpay-trigger-button (Nexora identity)', () => {
  let el: TriggerButton;

  afterEach(() => el?.remove());

  async function mount(props: Partial<TriggerButton> = {}) {
    el = document.createElement('smartpay-trigger-button') as TriggerButton;
    Object.assign(el, props);
    document.body.appendChild(el);
    await el.updateComplete;
    return el.shadowRoot!;
  }

  it('defaults to the "Nexora" label with the inline SVG mark', async () => {
    const root = await mount();

    expect(root.querySelector('button')?.textContent?.trim()).toBe('Nexora');
    const mark = root.querySelector('svg.nexora-mark');
    expect(mark).not.toBeNull();
    expect(mark?.getAttribute('aria-label')).toBe('Nexora');
    expect(mark?.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
    expect(root.querySelector('img')).toBeNull();
  });

  it('keeps a custom label', async () => {
    const root = await mount({ label: 'Pagar' });

    expect(root.querySelector('button')?.textContent?.trim()).toBe('Pagar');
  });

  it('hides the mark on a config error', async () => {
    const root = await mount({ hasError: true });

    expect(root.querySelector('svg.nexora-mark')).toBeNull();
    expect(root.querySelector('button.error')).not.toBeNull();
  });
});
