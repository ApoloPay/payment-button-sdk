import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PaymentClient, type PaymentError, type PaymentDetails } from '@payment-button-sdk/core';

// 1. Importa los nuevos componentes hijos
import './components/trigger-button.js';
import './components/payment-modal.js';
// (Opcional) Importa estilos compartidos
// import { sharedStyles } from './styles/shared-styles.js';

@customElement('payment-button')
export class PaymentButton extends LitElement {
  // --- Props y Estado (se quedan igual) ---
  @property({ type: String, attribute: 'api-key' }) apiKey = '';
  @property({ type: Number }) amount = 0;
  @property({ type: String }) currency = 'USD';
  @state() private isOpen = false;
  @state() private status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  @state() private stablecoins: any[] = [];
  @state() private blockchains: any[] = [];
  @state() private error: PaymentError | null = null;
  private client!: PaymentClient;

  // --- Lógica de Inicialización (se queda igual) ---
  override connectedCallback() {
    super.connectedCallback();
    this.client = new PaymentClient({
      apiKey: this.apiKey, amount: this.amount, currency: this.currency,
      onSuccess: (response) => {
        this.status = 'success';
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('success', { detail: response }));
      },
      onError: (error) => {
        this.status = 'error';
        this.error = error;
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
      }
    });
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      this.stablecoins = await this.client.getStableCoins();
      this.blockchains = await this.client.getBlockchains();
    } catch (e) {
      console.error('Error al cargar datos', e);
    }
  }

  // --- Lógica de Control (ahora maneja el estado para los hijos) ---
  private openModal() { this.isOpen = true; }
  private closeModal() { this.isOpen = false; this.status = 'idle'; }

  private handleConfirmPayment(event: CustomEvent<PaymentDetails>) {
    const details = event.detail; // Recibe los detalles desde el modal hijo
    this.status = 'loading';
    this.client.initiatePayment(details);
  }

  // --- Estilos (Solo los necesarios para el layout, si los hay) ---
  static override styles = css`
    :host { 
      display: inline-block; 
    } 
    /* (Opcional) Puedes importar aquí sharedStyles si los creaste */
  `;

  // --- Render (Ahora usa los componentes hijos) ---
  protected override render() {
    return html`
      <trigger-button 
        .status=${this.status} 
        @open=${this.openModal}
      >
        <slot></slot>
      </trigger-button>

      <payment-modal
        ?isOpen=${this.isOpen}
        .status=${this.status}
        .error=${this.error}
        .stablecoins=${this.stablecoins}
        .blockchains=${this.blockchains}
        .amount=${this.amount}
        .currency=${this.currency}
        @close=${this.closeModal}
        @confirm=${this.handleConfirmPayment}
      ></payment-modal>
    `;
  }
}