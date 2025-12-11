import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { logoApolo } from '../assets/logo_apolo.js'

@customElement('trigger-button')
export class TriggerButton extends LitElement {
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) amount = 0;
  @property({ type: String }) label?: string = undefined;

  static override styles = [
    sharedStyles,
    css`
      :host { display: inline-block; }

      .button-wrapper {
        --img-size: 24px;
        --gap: 8px;
      }
      
      button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 12px 32px;
        
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        color: var(--apolo-on-primary);
        
        background: #74727225;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;

        text-indent: var(--img-size);
        mix-blend-mode: difference;
        z-index: 1; 
      }

      button::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        padding: 2px;
        background: linear-gradient(90deg, var(--apolo-primary), #ffffff);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        z-index: -1;
      }

      button:hover {
        transform: translateY(-1px);
        background-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .button-wrapper:hover img {
        transform: translateY(calc(-50% - 1px));
      }

      button:active {
        transform: translateY(0);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        filter: grayscale(1);
        transform: none;
      }

      .logo-apolo {
        position: absolute;
        top: 50%;
        left: calc((var(--img-size) / 2) + var(--gap));
        transform: translateY(-50%);
        width: var(--img-size);
        height: var(--img-size);
        margin-right: var(--gap);
        transition: transform 0.2s;
      }
    `
  ];

  protected override render() {
    const defaultLabel = this.loading
      ? 'Cargando...'
      : this.label || `Apolo Pay`;

    return html`
      <div class="button-wrapper">
        <img class="logo-apolo" src="${logoApolo}" alt="Icon" />
        <button ?disabled=${this.disabled || this.loading} type="button">
          ${defaultLabel}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'trigger-button': TriggerButton;
  }
}