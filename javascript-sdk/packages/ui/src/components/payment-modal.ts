import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ModalStep, type Network, type PaymentError } from '@payment-button-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props Received from Parent ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Number }) currentStep: ModalStep = ModalStep.SELECT_ASSET;
  @property({ type: String }) status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  @property({ type: Object }) error: PaymentError | null = null;
  @property({ type: Boolean }) isLoadingData = true; // For initial asset/network load
  @property({ type: Array }) assets: any[] = [];
  @property({ type: String }) selectedAsset: string | null = null;
  @property({ type: String }) selectedNetwork: string | null = null;
  @property({ type: String }) qrCodeUrl: string | null = null;
  @property({ type: String }) paymentAddress: string | null = null;
  @property({ type: Number }) amount = 0;

  // --- DOM Element Reference ---
  @query('dialog') private dialogElement!: HTMLDialogElement;

  // --- Lifecycle: Manage Dialog State ---
  override async updated(changedProperties: Map<string | number | symbol, unknown>) {
    // Wait for Lit's rendering cycle to complete
    await this.updateComplete;

    if (changedProperties.has('isOpen')) {
      const dialog = this.dialogElement;
      if (!dialog) return; // Guard clause

      if (this.isOpen) {
        // --- Opening ---
        dialog.classList.remove('closing'); // Remove closing class if present
        if (!dialog.open) {
          dialog.showModal(); // Use showModal() for true modal behavior
        }
        dialog.addEventListener('click', this.handleBackdropClick); // Add backdrop listener
      } else {
        // --- Closing ---
        dialog.removeEventListener('click', this.handleBackdropClick); // Remove listener immediately
        dialog.classList.add('closing'); // Add class to trigger closing animation

        // Listen for animation end, then call native close()
        dialog.addEventListener('transitionend', () => {
          // Only close if it's still intended to be closed
          if (!this.isOpen) {
            dialog.close();
          }
          dialog.classList.remove('closing'); // Clean up class
        }, { once: true }); // Listener cleans itself up
      }
    }
  }

  // --- Event Dispatchers (Emit events to parent) ---

  // Request to close the modal (triggered by X, backdrop, Escape)
  private requestClose() {
    // Don't allow closing if a critical loading state is happening (e.g., final payment)
    if (this.status === 'loading' && this.currentStep === ModalStep.RESULT) return;
    this.dispatchEvent(new CustomEvent('closeRequest'));
  }

  // Handle clicks potentially on the backdrop
  private handleBackdropClick = (event: MouseEvent) => {
    if (event.target !== this.dialogElement) return;

    // Prevent closing if already animating closed
    if (this.dialogElement.classList.contains('closing')) return;

    const rect = this.dialogElement.getBoundingClientRect();
    const clickedOutside = (
      event.clientY < rect.top || event.clientY > rect.bottom ||
      event.clientX < rect.left || event.clientX > rect.right
    );
    if (clickedOutside) {
      this.requestClose();
    }
  }

  // Handle the native 'close' event (fired by Escape key)
  private handleDialogNativeClose(event: Event) {
    event.preventDefault(); // Prevent the default immediate close
    this.requestClose(); // Trigger our animated close flow
  }

  // Emit event when a asset is selected
  private selectAsset(assetId: string) {
    this.dispatchEvent(new CustomEvent('assetSelect', { detail: { assetId } }));
  }

  // Emit event when a network is selected
  private selectNetwork(networkId: string) {
    this.dispatchEvent(new CustomEvent('networkSelect', { detail: { networkId } }));
  }

  // Emit event to request changing step (for "Back" buttons)
  private changeStep(step: ModalStep, e?: Event) {
    e?.stopPropagation(); // Prevent event bubbling if from a button click
    this.dispatchEvent(new CustomEvent('changeStep', { detail: step }));
  }

  // Helper para saber si es Apolo Pay (ajusta el ID según tu backend)
  private get isApoloPayNetwork() {
    return this.selectedNetwork === 'apolo-pay' || this.selectedNetwork === 'apolo_pay';
  }

  // --- Styles ---
  static override styles = [
    sharedStyles,
    modalBaseStyles,
    css`
      /* --- HEADER --- */
      .modal-header {
        position: relative; /* Para posicionar el botón de cerrar */
        padding: 1.5rem 1.5rem 0.5rem;
        display: flex;
        justify-content: center; /* Título centrado si lo hubiera */
        align-items: center;
      }

      .close-button, .back-button {
        position: absolute;
        top: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        transition: color 0.2s;
        padding: 5px;
      }
      .close-button { right: 1.5rem; font-size: 1.5rem; }
      .back-button { left: 1.5rem; font-size: 1.2rem; }
      .close-button:hover, .back-button:hover { color: #374151; }

      /* --- BODY --- */
      .modal-body {
        padding: 1rem 2rem 2.5rem; /* Padding generoso abajo */
        text-align: center;
      }

      /* Títulos */
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: #111827;
      }
      .highlight { color: #ea580c; } /* Naranja de tus imágenes */
      
      p.subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0 0 1.5rem;
        line-height: 1.4;
      }

      /* --- LISTAS DE SELECCIÓN (Botones grandes blancos) --- */
      .selection-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .selection-card {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #f3f4f6; /* Borde muy sutil */
        border-radius: 16px;
        padding: 1rem;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      }

      .selection-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        border-color: #ea580c; /* Hover naranja */
      }

      .coin-icon {
        width: 40px;
        height: 40px;
        margin-right: 1rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .card-text {
        text-align: left;
        display: flex;
        flex-direction: column;
      }
      .card-title { font-weight: 600; font-size: 1rem; color: #1f2937; }
      .card-sub { font-size: 0.8rem; color: #9ca3af; text-transform: uppercase;}

      /* --- QR SCREENS --- */
      .timer {
        color: #ea580c;
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: block;
      }

      .qr-frame {
        background: white;
        padding: 10px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        display: inline-block;
        margin-bottom: 1rem;
      }
      .qr-frame img { display: block; border-radius: 8px; width: 160px; height: 160px; }
      
      .amount-badge {
        background: #fff7ed; /* Naranja muy claro */
        color: #ea580c;
        font-weight: 700;
        padding: 0.25rem 1rem;
        border-radius: 20px;
        display: inline-block;
        margin-top: -10px; /* Superpuesto o pegado al QR */
        position: relative;
        z-index: 2;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }

      /* Inputs de solo lectura (Diseño Apolo) */
      .info-field {
        margin-top: 1rem;
        text-align: left;
      }
      .info-label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-left: 0.5rem;
        margin-bottom: 0.25rem;
        display: block;
      }
      .info-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #f9fafb;
        color: #4b5563;
        font-family: monospace;
        font-size: 0.9rem;
      }

      /* Botón Naranja Grande */
      .btn-primary {
        background-color: #ea580c; /* Naranja Apolo */
        color: white;
        width: 100%;
        padding: 1rem;
        border-radius: 30px; /* Pill shape */
        border: none;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1.5rem;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
        transition: transform 0.1s, box-shadow 0.1s;
      }
      .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(234, 88, 12, 0.4); }
      
      /* Botón Azul Oscuro (Apolo Pay QR) */
      .btn-dark {
        background-color: #111827; /* Azul casi negro */
        color: white;
        width: 100%;
        padding: 1rem;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1.5rem;
      }

      .warning-text {
        font-size: 0.75rem;
        color: #6b7280;
        text-align: left;
        margin-top: 1.5rem;
        line-height: 1.5;
      }
      .warning-text strong { color: #ea580c; }
    `
  ];

  // --- RENDERIZADO DEL QR (Lógica bifurcada) ---
  private renderQRStep() {
    // 1. Caso Apolo Pay (Imagen 7cfdc3.png)
    if (this.isApoloPayNetwork) {
      return html`
        <span class="timer">29 min : 59 seg</span>
        
        <div class="qr-frame">
          <img src="${this.qrCodeUrl}" alt="QR Apolo Pay" />
        </div>
        <div class="amount-badge">${this.amount} USDT</div>

        <div class="warning-text">
          <ul>
            <li>Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.</li>
            <li>Solo se aceptan <strong>depósitos en USDT</strong>.</li>
          </ul>
        </div>

        <button class="btn-dark">
          Escanea con tu celular y continua desde la app de <span style="color: #ea580c">Apolo Pay</span>
        </button>
        
        <button class="btn-primary" @click=${() => {
          this.status = "success"
          this.changeStep(ModalStep.RESULT)
        }}>
          Ya pagué
        </button>
      `;
    }

    // 2. Caso Red Externa (Imagen 7cfdbd.png)
    return html`
      <span class="timer">29 min : 59 seg</span>
      
      <div class="qr-frame">
        <img src="${this.qrCodeUrl}" alt="QR Wallet" />
      </div>
      <div class="amount-badge">${this.amount} USDT</div>

      <div class="info-field">
        <span class="info-label">Red</span>
        <input class="info-input" readonly value="${this.selectedNetwork}" />
      </div>

      <div class="info-field">
        <span class="info-label">Dirección de depósito</span>
        <div style="position: relative">
           <input class="info-input" readonly value="${this.paymentAddress}" />
           </div>
      </div>

      <div class="warning-text">
         Realiza el pago dentro del tiempo indicado.
      </div>

      <button class="btn-primary" @click=${() => {
        this.status = "error"
        this.changeStep(ModalStep.RESULT)
      }}>
        Ya pagué
      </button>
    `;
  }

  // --- Render Method ---
  protected override render() {
    let content;
    const currentAsset = this.assets.find(asset => asset.id === this.selectedAsset);

    // Header simple con navegación
    const header = html`
      <div class="modal-header">
        ${this.currentStep > ModalStep.SELECT_ASSET
        ? html`<button class="back-button" @click=${() => this.changeStep(this.currentStep - 1)} >&larr;</button>`
        : ''}
        <button class="close-button" @click=${this.requestClose}>&times;</button>
      </div>
    `;

    // Selección de Asset
    if (this.currentStep === ModalStep.SELECT_ASSET) {
      content = html`
        <h2>Selecciona la <span class="highlight">stablecoin</span></h2>
        <p class="subtitle">Selecciona la stablecoin con la que deseas pagar</p>
        
        <div class="selection-list">
          ${this.assets.map(asset => html`
            <div class="selection-card" @click=${() => this.selectAsset(asset.id)}>
              <img src="${asset.image}" class="coin-icon" />
              <div class="card-text">
                <span class="card-title">${asset.symbol}</span>
                <span class="card-sub">${asset.name}</span>
              </div>
            </div>
          `)}
        </div>
        <p class="subtitle" style="margin-top: 1.5rem">Luego podrás seleccionar la red</p>
      `;
    }
    // Selección de Red
    else if (this.currentStep === ModalStep.SELECT_NETWORK) {
      content = html`
        <h2>Selecciona la <span class="highlight">red</span></h2>
        <p class="subtitle">Selecciona la red de tu preferencia</p>

        <div class="selection-list">
          ${currentAsset.networks.map((network: Network) => html`
            <div class="selection-card" @click=${() => this.selectNetwork(network.id)}>
              <img src="${network.image}" class="coin-icon" />
              <div class="card-text">
                <span class="card-title">${network.name}</span>
              </div>
            </div>
          `)}
        </div>
       `;
    }
    // QR
    else if (this.currentStep === ModalStep.SHOW_QR) {
      content = html`
        <h2>Depósito <span class="highlight">USDT</span></h2>
        <p class="subtitle">Titulo del producto o servicio a pagar</p>
        ${this.renderQRStep()}
      `;
    }
    // Resultado
    else if (this.currentStep === ModalStep.RESULT) {
      // Display final success or error message
      if (this.status === 'success') {
        content = html`
          <div class="result-message" style="text-align: center;">
            <div class="result-icon">✅</div> <h2>¡Pago Exitoso!</h2>
            <p>Tu pago ha sido confirmado correctamente.</p>
            <button class="primary-button" @click=${this.requestClose}>Cerrar</button>
          </div>
        `;
      } else if (this.status === 'error') {
        content = html`
          <div class="result-message" style="text-align: center;">
              <div class="result-icon">❌</div> <h2>Error en el Pago</h2>
              <p>${this.error?.message || 'Ocurrió un error inesperado durante el pago.'}</p>
              <button class="action-button" @click=${this.requestClose}>Cerrar</button>
          </div>
        `;
      } else {
        // Intermediate state while waiting for WebSocket confirmation (optional)
        content = html`<div class="loading-indicator">Verificando pago...<div class="spinner"></div></div>`;
      }
    }

    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        ${header}
        <div class="modal-body">
          ${content}
        </div>
      </dialog>
    `;
  } // End render
} // End class

// Global type declaration
declare global {
  interface HTMLElementTagNameMap {
    'payment-modal': PaymentModal;
  }
}