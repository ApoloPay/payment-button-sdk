import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { nexoraMark } from '../assets/nexora_mark.js'
import { I18n, type Locale } from '@nexora-smartpay/core';

export class TriggerButton extends LitElement {
  @property({ type: String }) override lang: Locale = 'es';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label?: string = undefined;
  @property({ type: Boolean }) hasError = false;

  static override styles = [
    sharedStyles,
    css`
      :host { display: inline-block; }

      .button-wrapper {
        --img-size: 24px;
        --gap: 8px;
        position: relative;
        color: var(--smartpay-on-primary);
      }

      /* Botón principal Nexora: negro, texto blanco, esquinas suaves (no píldora). */
      button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 12px 32px;

        font-family: var(--smartpay-font);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: var(--smartpay-on-primary);

        background-color: var(--smartpay-primary);
        border: 1px solid var(--smartpay-primary);
        border-radius: var(--smartpay-radius-lg);
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s, border-color 0.2s;

        text-indent: var(--img-size);
      }

      button:hover {
        transform: translateY(-1px);
        background-color: var(--smartpay-primary-darkest);
        border-color: var(--smartpay-primary-darkest);
      }

      .button-wrapper:hover .nexora-mark {
        transform: translateY(calc(-50% - 1px));
      }

      button:active {
        transform: translateY(0);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .button-wrapper:has(button:disabled) .nexora-mark {
        opacity: 0.6;
      }

      button.error {
        background-color: #ffffff;
        border-color: #b42332;
        color: #b42332;
        text-indent: 0;
      }

      .nexora-mark {
        position: absolute;
        top: 50%;
        left: calc((var(--img-size) / 2) + var(--gap));
        transform: translateY(-50%);
        width: var(--img-size);
        height: var(--img-size);
        margin-right: var(--gap);
        transition: transform 0.2s;
        z-index: 1;
        pointer-events: none;
      }
    `
  ];

  protected override render() {
    const t = I18n.t;

    const defaultLabel = this.hasError
      ? ((t.errors as any).config || 'Config Error')
      : (this.loading ? t.trigger.loading : (this.label || 'Nexora'));

    return html`
      <div class="button-wrapper">
        ${this.hasError ? '' : nexoraMark('nexora-mark')}
        <button 
          ?disabled=${this.disabled || this.loading || this.hasError} 
          class="${this.hasError ? 'error' : ''}"
          type="button"
        >
          ${defaultLabel}
        </button>
      </div>
    `;
  }
}

if (!customElements.get('smartpay-trigger-button')) {
  customElements.define('smartpay-trigger-button', TriggerButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'smartpay-trigger-button': TriggerButton;
  }
}