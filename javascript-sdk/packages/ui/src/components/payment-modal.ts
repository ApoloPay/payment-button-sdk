import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ModalStep, type Asset, type Network, type PaymentError } from '@payment-button-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';
import { textFieldBaseStyles } from '../styles/text-field-base';
import { supportUrl } from '../utils/constants';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props Received from Parent ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Number }) currentStep: ModalStep = ModalStep.SELECT_ASSET;
  @property({ type: String }) status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  @property({ type: Object }) error: PaymentError | null = null;
  @property({ type: Boolean }) isLoadingData = true; // For initial asset/network load
  @property({ type: Array }) assets: Asset[] = [];
  @property({ type: String }) selectedAsset: string | null = null;
  @property({ type: String }) selectedNetwork: string | null = null;
  @property({ type: String }) qrCodeUrl: string | null = null;
  @property({ type: String }) paymentAddress: string | null = null;
  @property({ type: Number }) amount = 0;
  @property({ type: String }) email = '';

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

  private get currentAsset(): Asset | undefined {
    return this.assets.find(asset => asset.id === this.selectedAsset)
  }

  // Helper para saber si es Apolo Pay (ajusta el ID según tu backend)
  private get isApoloPayNetwork() {
    const network = this.currentAsset?.networks.find(network => network.id === this.selectedNetwork);

    return network?.network === 'apolopay';
  }

  // --- Styles ---
  static override styles = [
    sharedStyles,
    modalBaseStyles,
    textFieldBaseStyles,
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
      }
      .highlight { color: var(--apolo-accent); } /* Naranja de tus imágenes */
      
      p.subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0 0 1rem;
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
        border-color: var(--apolo-accent); /* Hover naranja */
      }

      .coin-icon {
        width: 40px;
        height: 40px;
        margin-right: 1rem;
        object-fit: cover;
      }

      .card-text {
        text-align: left;
        display: flex;
        flex-direction: column;
      }
      .card-title { font-weight: 600; font-size: 1rem; color: var(--apolo-text); }
      .card-sub { font-size: 0.8rem; color: var(--apolo-text-muted); text-transform: uppercase;}

      /* --- QR SCREENS --- */
      .timer {
        color: var(--apolo-accent);
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: block;
      }

      .qr-frame {
        background: white;
        padding: 10px;
        padding-bottom: 14px;
        border-radius: var(--apolo-radius);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        display: inline-block;
        margin-bottom: 1rem;
      }
      .qr-frame img { display: block; border-radius: 8px; width: 130px; height: 130px; }
      
      .amount-badge {
        color: var(--apolo-accent);
        font-weight: 700;
        font-size: 1.2rem;
        display: inline-block;
        margin-top: 10px;
      }

      /* Botón Naranja Grande */
      .btn-primary {
        background-color: var(--apolo-accent); /* Naranja Apolo */
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: var(--apolo-radius-lg); /* Pill shape */
        border: none;
        font-weight: 400;
        font-size: .9rem;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
        transition: transform 0.1s, box-shadow 0.1s;
      }
      .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(234, 88, 12, 0.4); }
      
      /* Botón Azul Oscuro (Apolo Pay QR) */
      .btn-dark {
        background-color: var(--apolo-primary-darkest);
        color: white;
        width: 100%;
        padding: 1rem;
        border-radius: var(--apolo-radius);
        border: none;
        font-weight: 600;
        cursor: pointer;
        margin-block: 0.25rem 1.25rem;
      }

      .warning-text {
        font-size: 0.75rem;
        text-align: left;
        margin-top: 1.5rem;
        line-height: 1.5;
      }
      .warning-text strong { color: var(--apolo-accent); }

      .warning-text ul {
        padding-left: 1.5rem;
      }


      /* --- PANTALLA DE RESULTADO --- */
      .result-container {
        text-align: center;
        animation: fadeIn 0.5s ease-out;
      }

      /* Animación simple de entrada */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
      }

      /* Animación del Check SVG */
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke: #22c55e; /* Verde éxito */
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        stroke: #22c55e;
        stroke-width: 4;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
      }
      @keyframes stroke { 100% { stroke-dashoffset: 0; } }

      .result-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .result-desc {
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .purchase-details {
        text-align: left;
        margin-bottom: 1.5rem;
      }

      .details-title {
        font-size: 1rem;
        font-weight: 700;
        text-decoration: underline;
        text-decoration-color: var(--apolo-text);
        text-underline-offset: 4px;
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .support-text {
        font-size: 0.85rem;
        margin-bottom: 1rem;
      }
      
      /* Estilo Error */
      .error-icon { font-size: 4rem; margin-bottom: 1rem; }
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
          <span class="amount-badge">${this.amount} USDT</span>
        </div>

        <div class="warning-text">
          <ul>
            <li>Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.</li>
            <li>No envíes NFTs a esta wallet.</li>
            <li>Solo se aceptan <strong>depósitos en USDT</strong>. El envío de otro tipo de token podría resultar en su pérdida.</li>
          </ul>
          <p>Realiza el pago dentro del tiempo indicado. <strong>30:00 min</strong> De lo contrario, el código QR se vencerá y deberás generar uno nuevo.</p>
        </div>

        <button class="btn-dark">
          Escanea con tu celular y continua desde la app de <span style="color: var(--apolo-accent)">Apolo Pay</span>
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
        <span class="amount-badge">${this.amount} USDT</div>
      </div>

      <div class="text-field">
        <label class="text-field-label">Red</label>
        <input class="text-field-input" readonly value="${this.selectedNetwork}" />
      </div>

      <div class="text-field">
        <label class="text-field-label">Dirección de depósito</label>
        <input class="text-field-input" readonly value="${this.paymentAddress}" />
      </div>

      <div class="warning-text">
        <ul>
          <li>Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.</li>
          <li>No envíes NFTs a esta wallet.</li>
          <li>Solo se aceptan <strong>depósitos en USDT</strong>. El envío de otro tipo de token podría resultar en su pérdida.</li>
        </ul>
        <p>Realiza el pago dentro del tiempo indicado. <strong>30:00 min</strong> De lo contrario, el código QR se vencerá y deberás generar uno nuevo.</p>
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

    // Header simple con navegación
    const header = html`
      <div class="modal-header">
        ${this.currentStep > ModalStep.SELECT_ASSET && this.currentStep < ModalStep.RESULT
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
        <p class="warning-text" style="font-size: 0.9rem; text-align: center; margin-top: 1.5rem">
          Luego podrás seleccionar la red de tu preferencia
        </p>
      `;
    }
    // Selección de Red
    else if (this.currentStep === ModalStep.SELECT_NETWORK) {
      content = html`
        <h2>Selecciona la <span class="highlight">red</span></h2>
        <p class="subtitle">Selecciona la red de tu preferencia</p>

        <div class="selection-list">
          ${this.currentAsset?.networks.map((network: Network) => html`
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
          <div class="result-container">
            <div class="success-icon">
              <svg viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <h2 class="result-title">¡Gracias por <span class="highlight">tu compra!</span></h2>
            
            <p class="result-desc">
              Tu pago fue exitoso y en breve recibirás un correo 
              (${this.email ? html`<span class="highlight">${this.email}</span>` : 'de confirmación'})
              con los detalles de tu producto o servicio
            </p>

            <div class="purchase-details">
              <h3 class="details-title">Detalles de la compra</h3>
              
              <div class="text-field">
                <label class="text-field-label">Producto o Servicio</label>
                <input class="text-field-input" readonly value="Titulo del producto o servicio" />
              </div>

              <div class="text-field">
                <label class="text-field-label">Monto</label>
                <input class="text-field-input" readonly value="${this.amount} USD" />
              </div>
            </div>

            <p class="support-text">
              Cualquier duda o inquietud puedes comunicarte con soporte
            </p>

            <button class="btn-primary" @click=${() => window.open(supportUrl, '_blank')}>
              Soporte
            </button>
          </div>
        `;
      } else if (this.status === 'error') {
        content = html`
          <div class="result-container">
            <div class="error-icon">❌</div>
            <h2 class="result-title">Error en el Pago</h2>
            <p class="result-desc">${this.error?.message || 'Ocurrió un error inesperado.'}</p>
            <button class="btn-primary" @click=${this.requestClose}>Cerrar</button>
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