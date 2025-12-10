import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';

@customElement('trigger-button')
export class TriggerButton extends LitElement {
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) amount = 0;
  @property({ type: String }) label?: string = undefined;

  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }
      
      button {
        /* Usamos las variables definidas en shared-styles */
        background-color: var(--apolo-primary);
        color: var(--apolo-on-primary);
        border: none;
        padding: 10px 20px;
        border-radius: var(--apolo-radius);
        font-family: var(--apolo-font);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        
        /* Asegura que el botón ocupe todo el espacio del host */
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      button:hover {
        opacity: 0.9;
      }

      button:disabled {
        background-color: #a1a1a1;
        cursor: not-allowed;
      }
    `
  ];

  protected override render() {
    // Calculamos el texto del botón por defecto
    const defaultLabel = this.loading
      ? 'Cargando...'
      : this.label || `Pagar ${this.amount > 0 ? '$' + this.amount : ''}`;

    return html`
      <button ?disabled=${this.disabled || this.loading} type="button">
        ${defaultLabel}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'trigger-button': TriggerButton;
  }
}