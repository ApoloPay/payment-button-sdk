import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('trigger-button')
export class TriggerButton extends LitElement {
  @property({ type: String })
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';

  private handleClick() {
    // Despacha un evento 'open' para que el padre lo escuche
    this.dispatchEvent(new CustomEvent('open'));
  }

  static override styles = css`
    button {
      background-color: #4f46e5; /* Color por defecto */
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    button:disabled {
      background-color: #a1a1a1;
      cursor: not-allowed;
    }
    /* Puedes añadir más estilos o usar variables de shared-styles */
  `;

  protected override render() {
    const isLoading = this.status === 'loading';
    return html`
      <button @click=${this.handleClick} ?disabled=${isLoading}>
        ${isLoading ? 'Procesando...' : html`<slot>Pagar</slot>`}
      </button>
    `;
  }
}

// Declara el tipo globalmente para que TypeScript no se queje
// al usar <trigger-button> en otros archivos.
declare global {
  interface HTMLElementTagNameMap {
    'trigger-button': TriggerButton;
  }
}