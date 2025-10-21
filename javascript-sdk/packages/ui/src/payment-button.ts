import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PaymentClient, type PaymentError, type PaymentDetails } from '@payment-button-sdk/core';

// 1. @customElement define el nombre de la etiqueta HTML
@customElement('payment-button')
export class PaymentButton extends LitElement {

  // 2. @property define las props (atributos HTML)
  // Estos vienen del exterior (ej. <payment-button apiKey="...">)
  @property({ type: String, attribute: 'api-key' })
  apiKey = '';

  @property({ type: Number })
  amount = 0;

  @property({ type: String })
  currency = 'USD';

  // 3. @state define el estado interno
  @state()
  private isOpen = false;

  @state()
  private status: 'idle' | 'loading' | 'success' | 'error' = 'idle';

  @state()
  private stablecoins: any[] = [];

  @state()
  private blockchains: any[] = [];

  @state()
  private error: PaymentError | null = null;

  // 4. Referencia al cliente de API
  private client!: PaymentClient;

  // 5. 'connectedCallback' es el 'useEffect' o 'onMounted' de los Web Components
  // Se llama cuando el componente se añade al DOM.
  override connectedCallback() {
    super.connectedCallback();

    // Creamos la instancia del cliente
    this.client = new PaymentClient({
      apiKey: this.apiKey,
      amount: this.amount,
      currency: this.currency,
      onSuccess: (response) => {
        this.status = 'success';
        this.isOpen = false;
        // Despachamos un evento nativo del navegador
        this.dispatchEvent(new CustomEvent('success', { detail: response }));
      },
      onError: (error) => {
        this.status = 'error';
        this.error = error;
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
      }
    });

    // Cargamos los datos para el modal
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

  // 6. Métodos internos
  private openModal() {
    this.isOpen = true;
  }

  private closeModal() {
    this.isOpen = false;
    this.status = 'idle'; // Resetea el estado si se cierra
  }

  private handleConfirmPayment() {
    // (Aquí recolectarías los datos de los <select>)
    const details: PaymentDetails = {
      stablecoin: 'USDC', // Ejemplo
      blockchain: 'ETH',  // Ejemplo
    };

    this.status = 'loading';
    this.client.initiatePayment(details);
  }

  // 7. Estilos (Shadow DOM)
  // ¡Estos estilos están 100% encapsulados! No afectarán al resto de la página.
  static override styles = css`
    :host {
      display: inline-block;
    }

    /* Estilos para el botón de trigger */
    .trigger-button {
      background-color: #4f46e5;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    .trigger-button:disabled {
      background-color: #a1a1a1;
    }

    /* Estilos para el Modal (<dialog>) */
    dialog {
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 1.5rem;
      min-width: 300px;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;

  // 8. El método render() define el HTML
  protected override render() {
    return html`
      <button 
        class="trigger-button"
        @click=${this.openModal}
        ?disabled=${this.status === 'loading'}
      >
        ${this.status === 'loading' ? 'Procesando...' : html`<slot></slot>`}
      </button>

      <dialog ?open=${this.isOpen} @close=${this.closeModal}>

        <div class="modal-header">
          <h3>Selecciona tu método</h3>
          <button @click=${this.closeModal}>X</button>
        </div>

        <p>Pagar ${this.amount} ${this.currency}</p>

        <div>
          <label>Moneda:</label>
          <select>
            ${this.stablecoins.map(coin => html`<option value=${coin.id}>${coin.name}</option>`)}
          </select>
        </div>

        <div>
          <label>Red:</label>
          <select>
            ${this.blockchains.map(chain => html`<option value=${chain.id}>${chain.name}</option>`)}
          </select>
        </div>

        <hr>

        <button @click=${this.handleConfirmPayment} ?disabled=${this.status === 'loading'}>
          ${this.status === 'loading' ? 'Confirmando...' : 'Confirmar Pago'}
        </button>

        ${this.status === 'error' ? html`<p style="color:red">${this.error?.message}</p>` : ''}
      </dialog>
    `;
  }
}