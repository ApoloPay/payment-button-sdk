import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { I18n, ModalStep } from '@payment-button-sdk/core';
import type { Locale, Asset, Network, PaymentError, Dictionary } from '@payment-button-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';
import { textFieldBaseStyles } from '../styles/text-field-base';
import { supportUrl } from '../utils/constants';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { logoApolo } from '../assets/logo_apolo'
import { qrBaseStyles } from '../styles/qr-base';
import { handleImageError } from '../utils/image_error';
import { spinnerStyles } from '../styles/spinner-styles';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props Received from Parent ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String }) lang: Locale = 'es';
  @property({ type: String }) productTitle = '';
  @property({ type: Number }) currentStep: ModalStep = ModalStep.SELECT_ASSET;
  @property({ type: String }) status: 'idle' | 'success' | 'error' = 'idle';
  @property({ type: Object }) error: PaymentError | null = null;
  @property({ type: Boolean }) isLoadingData = true; // For initial asset/network load
  @property({ type: Array }) assets: Asset[] = [];
  @property({ type: String }) selectedAsset: string | null = null;
  @property({ type: String }) selectedNetwork: string | null = null;
  @property({ type: String }) qrCodeUrl: string | null = null;
  @property({ type: String }) paymentAddress: string | null = null;
  @property({ type: Number }) amount = 0;
  @property({ type: String }) email = '';
  @property({ type: String }) qrCodeExpiresAt: string | null = null;

  @state() private timerString: string = '-- : --';
  private _timerInterval: number | null = null;

  // --- DOM Element Reference ---
  @query('dialog') private dialogElement!: HTMLDialogElement;

  override disconnectedCallback() {
    this.stopTimer();
    super.disconnectedCallback();
    // 🛡️ SEGURIDAD CRÍTICA:
    // Si el componente se desmonta del DOM mientras el diálogo está abierto,
    // forzamos el cierre nativo inmediatamente para eliminar el backdrop.
    const dialog = this.dialogElement;
    if (dialog && dialog.open) {
      dialog.close(); 
    }
  }

  // --- Lifecycle: Manage Dialog State ---
  override async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    // Wait for Lit's rendering cycle to complete
    await this.updateComplete;

    // Si entramos al paso QR y tenemos fecha de expiración
    if (
      (changedProperties.has('currentStep') || changedProperties.has('isOpen') || changedProperties.has('qrCodeExpiresAt')) &&
      this.isOpen && 
      this.currentStep === ModalStep.SHOW_QR &&
      this.qrCodeExpiresAt // Solo iniciamos si hay fecha
    ) {
      this.startTimerFromDate(this.qrCodeExpiresAt);
    } 
    
    // Limpieza si salimos
    else if (!this.isOpen || this.currentStep !== ModalStep.SHOW_QR) {
      this.stopTimer();
    }

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
        // --- LÓGICA DE CIERRE MEJORADA ---
        dialog.removeEventListener('click', this.handleBackdropClick);
        
        // Si ya está cerrado, no hacemos nada
        if (!dialog.open) return;

        dialog.classList.add('closing');

        const onAnimationEnd = (e: AnimationEvent) => {
          // 🛡️ FILTRO: Asegurarse de que el evento viene del dialog y no de un hijo (spinner, etc)
          if (e.target === dialog) {
            this.closeDialogFinal(dialog, onAnimationEnd);
          }
        };

        dialog.addEventListener('animationend', onAnimationEnd);
        
        // 🛡️ TIMEOUT DE SEGURIDAD REDUCIDO:
        // Si la animación falla o el navegador se congela, forzamos cierre en 200ms
        setTimeout(() => {
          if (dialog.open) this.closeDialogFinal(dialog, onAnimationEnd);
        }, 200);
      }
    }
  }

  // Helper actualizado
  private closeDialogFinal(dialog: HTMLDialogElement, listener: any) {
    dialog.removeEventListener('animationend', listener);
    dialog.classList.remove('closing');

    // Verificamos de nuevo si sigue abierto antes de cerrar
    if (dialog.open) dialog.close();
  }

  // --- Event Dispatchers (Emit events to parent) ---

  // Request to close the modal (triggered by X, backdrop, Escape)
  private requestClose() {
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


  // --- LÓGICA DEL TIMER BASADA EN FECHA ---
  private startTimerFromDate(isoDateString: string) {
    this.stopTimer();

    // Convertimos la fecha del backend a milisegundos locales
    const endTime = new Date(isoDateString).getTime();

    // Validamos que sea una fecha válida
    if (isNaN(endTime)) {
      console.error('Invalid date:', isoDateString);
      this.timerString = "00:00";
      return;
    }

    // Función de actualización
    const tick = () => {
      const now = Date.now();
      const distance = endTime - now;

      if (distance <= 0) {
        this.stopTimer();
        this.timerString = "00 min : 00 seg";

        this.status = 'error';
        
        this.error = {
          code: 'PAYMENT_TIMEOUT',
          message: I18n.t.errors.timeout
        };
        
        this.changeStep(ModalStep.RESULT);

        this.dispatchEvent(new CustomEvent('expired', { detail: { error: this.error } }));
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');

      this.timerString = `${m} min : ${s} seg`;
    };

    // Ejecutar inmediatamente y luego cada segundo
    tick();
    this._timerInterval = window.setInterval(tick, 1000);
  }

  private stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
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

  private get currentNetwork(): Network | undefined {
    return this.currentAsset?.networks.find(network => network.id === this.selectedNetwork)
  }

  private getFormattedTimeWindow(): string {
    if (!this.qrCodeExpiresAt) return '30 min';

    const endTime = new Date(this.qrCodeExpiresAt).getTime();
    const now = Date.now();
    const diffMs = endTime - now;

    if (diffMs <= 0) return '0 min';

    // Convertimos ms a minutos y redondeamos hacia arriba
    const minutes = Math.ceil(diffMs / (1000 * 60));
    
    return `${minutes} min`;
  }

  // --- Styles ---
  static override styles = [
    sharedStyles,
    modalBaseStyles,
    textFieldBaseStyles,
    qrBaseStyles,
    spinnerStyles,
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
  private renderQRStep(t: Dictionary) {
    const timeWindow = this.getFormattedTimeWindow();

    const warningTokenHTML = I18n.interpolate(t.modal.warnings.onlyToken, { 
      symbol: this.currentAsset?.symbol || '' 
    });

    const warningTimerHTML = I18n.interpolate(t.modal.warnings.timer, { 
      time: timeWindow 
    });

    const network = this.currentNetwork;

    // 1. Caso Apolo Pay (Imagen 7cfdc3.png)
    if (network?.network === 'apolopay') {
      return html`
        <span class="timer">${this.timerString}</span>
        
        <div class="qr-frame">
          <div class="qr-wrapper">
            <img src="${this.qrCodeUrl}" class="qr-code-img" alt="QR Apolo Pay" @error=${handleImageError} />
            
            <img src="${logoApolo}" class="qr-overlay-icon" alt="Network Icon" style="padding: 4px;" />
          </div>

          <span class="qr-badge">${this.amount} ${this.currentAsset?.symbol}</span>
        </div>

        <div class="warning-text">
          <ul>
            <li>${unsafeHTML(t.modal.warnings.networkMatch)}</li>
            <li>${unsafeHTML(t.modal.warnings.noNFT)}</li>
            <li>${unsafeHTML(warningTokenHTML)}</li>
          </ul>
          <p>${unsafeHTML(warningTimerHTML)}</p>
        </div>

        <button class="btn-dark">${unsafeHTML(t.modal.actions.scanApp)}</button>
        
        <button class="btn-primary" @click=${() => {
          this.status = "success"
          this.changeStep(ModalStep.RESULT)
        }}>
          ${t.modal.actions.paid}
        </button>
      `;
    }

    // 2. Caso Red Externa (Imagen 7cfdbd.png)
    return html`
      <span class="timer">${this.timerString}</span>
      
      <div class="qr-frame">
        <div class="qr-wrapper">
          <img src="${this.qrCodeUrl}" class="qr-code-img" alt="QR Wallet" @error=${handleImageError} />
          
          ${network 
            ? html`<img src="${network.image}" class="qr-overlay-icon" alt="Network Icon" @error=${handleImageError} />` 
            : ''
          }
        </div>
        <span class="qr-badge">${this.amount} ${this.currentAsset?.symbol}</span>
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.network}</label>
        <input class="text-field-input" readonly value="${this.selectedNetwork}" />
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.address}</label>
        <input class="text-field-input" readonly value="${this.paymentAddress}" />
      </div>

      <div class="warning-text">
        <ul>
          <li>${unsafeHTML(t.modal.warnings.networkMatch)}</li>
          <li>${unsafeHTML(t.modal.warnings.noNFT)}</li>
          <li>${unsafeHTML(warningTokenHTML)}</li>
        </ul>
        <p>${unsafeHTML(warningTimerHTML)}</p>
      </div>

      <button class="btn-primary" @click=${() => {
        this.status = "error"
        this.changeStep(ModalStep.RESULT)
      }}>
        ${t.modal.actions.paid}
      </button>
    `;
  }

  // --- Render Method ---
  protected override render() {
    const t = I18n.t;

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
        <h2>${unsafeHTML(t.modal.titles.selectAsset)}</h2>
        <p class="subtitle">${t.modal.subtitles.selectAsset}</p>
        
        <div class="selection-list">
          ${this.assets.map(asset => html`
            <div class="selection-card" @click=${() => this.selectAsset(asset.id)}>
              <img src="${asset.image}" class="coin-icon" @error=${handleImageError} />
              <div class="card-text">
                <span class="card-title">${asset.symbol}</span>
                <span class="card-sub">${asset.name}</span>
              </div>
            </div>
          `)}
        </div>
        <p class="warning-text" style="font-size: 0.9rem; text-align: center; margin-top: 1.5rem">
          ${t.modal.warnings.selectNetworkLater}
        </p>
      `;
    }
    // Selección de Red
    else if (this.currentStep === ModalStep.SELECT_NETWORK) {
      content = html`
        <h2>${unsafeHTML(t.modal.titles.selectNetwork)}</h2>
        <p class="subtitle">${t.modal.subtitles.selectNetwork}</p>

        <div class="selection-list">
          ${this.currentAsset?.networks.map((network: Network) => html`
            <div class="selection-card" @click=${() => this.selectNetwork(network.id)}>
              <img src="${network.network === 'apolopay' ? logoApolo : network.image}" class="coin-icon" @error=${handleImageError} />
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
        <h2>${unsafeHTML(I18n.interpolate(t.modal.titles.scanQr, { symbol: this.currentAsset?.symbol || '' }))}</h2>
        <p class="subtitle">${this.productTitle || t.modal.subtitles.scanQr}</p>
        ${this.renderQRStep(t)}
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

            <h2 class="result-title">${unsafeHTML(t.modal.titles.success)}</h2>
            
            <p class="result-desc">
              ${t.modal.success.message} (<span class="highlight">${this.email}</span>) ${t.modal.success.message2}
            </p>

            <div class="purchase-details">
              <h3 class="details-title">${t.modal.success.details}</h3>
              
              <div class="text-field">
                <label class="text-field-label">${t.modal.labels.product}</label>
                <input class="text-field-input" readonly value=${this.productTitle || t.modal.subtitles.scanQr} />
              </div>

              <div class="text-field">
                <label class="text-field-label">${t.modal.labels.amount}</label>
                <input class="text-field-input" readonly value="${this.amount} ${this.currentAsset?.symbol || ''}" />
              </div>
            </div>

            <p class="support-text">${t.modal.success.support}</p>

            <button class="btn-primary" @click=${() => window.open(supportUrl, '_blank')}>
              ${t.modal.actions.support}
            </button>
          </div>
        `;
      } else if (this.status === 'error') {
        content = html`
          <div class="result-container">
            <div class="error-icon">❌</div>
            <h2 class="result-title">${t.modal.titles.error}</h2>
            <p class="result-desc">${this.error?.message || t.errors.generic}</p>
            <button class="btn-primary" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `;
      } else {
        content = html`
          <div class="result-container">
            <div class="error-icon">⏳</div>
            <h2 class="result-title">${t.modal.titles.idle}</h2>
            <p class="result-desc">${t.modal.subtitles.idle}</p>
            <button class="btn-primary" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `;
      }
    }

    const showOverlay = 
      this.isLoadingData ||
      (this.currentStep === ModalStep.SHOW_QR && !this.qrCodeUrl)

    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        ${showOverlay 
          ? html`
              <div class="spinner-overlay">
                <div class="spinner"></div>
              </div>` 
          : ''
        }
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