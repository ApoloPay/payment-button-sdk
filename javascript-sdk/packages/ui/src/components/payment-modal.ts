import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ClientCode, I18n, ModalStep, isApoloPayNetwork } from '@apolopay-sdk/core';
import type { Locale, Asset, Network, Dictionary, ClientError } from '@apolopay-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';
import { textFieldBaseStyles } from '../styles/text-field-base';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { logoApolo } from '../assets/logo_apolo'
import { qrBaseStyles } from '../styles/qr-base';
import { handleImageError } from '../utils/image_error';
import { spinnerStyles } from '../styles/spinner-styles';
import './payment-timer.js';
import type { ModalStatus } from '../types/status.type';
import { amountFormatter } from '../utils/amount-formatter';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props Received from Parent ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Boolean }) barrierDismissible: boolean = false;
  @property({ type: String }) override lang: Locale = 'es';
  @property({ type: String }) productTitle = '';
  @property({ type: Number }) currentStep: ModalStep = ModalStep.SELECT_ASSET;
  @property({ type: String }) status: ModalStatus = 'idle';
  @property({ type: Object }) error: ClientError | null = null;
  @property({ type: Boolean }) isLoadingData = true; // For initial asset/network load
  @property({ type: Array }) assets: Asset[] = [];
  @property({ type: String }) selectedAsset: string | null = null;
  @property({ type: String }) selectedNetwork: string | null = null;
  @property({ type: String }) qrCodeUrl: string | null = null;
  @property({ type: String }) paymentAddress: string | null = null;
  @property({ type: Number }) amount = 0;
  @property({ type: Number }) amountPaid?: number = undefined;
  @property({ type: String }) email = '';
  @property({ type: Number }) qrCodeExpiresAt: number | null = null;
  @property({ type: String }) paymentUrl: string | null = null;
  @property({ type: Boolean }) isSandbox = false;

  @state() private isAddressCopied: boolean = false;
  @state() private sandboxPanelOpen: boolean = false;

  // --- DOM Element Reference ---
  @query('dialog') private dialogElement!: HTMLDialogElement;

  override disconnectedCallback() {
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

    // Timer is now managed by <payment-timer> component

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
    if (!this.barrierDismissible) return;

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
    event.preventDefault();
    if (!this.isOpen) return;
    this.requestClose();
  }

  private handleTimerExpired() {
    this.status = 'error';
    this.error = {
      code: ClientCode.payment_timeout,
      message: I18n.t.errors.timeout
    };
    this.changeStep(ModalStep.RESULT);
    this.dispatchEvent(new CustomEvent('expired', { detail: { error: this.error } }));
  }

  // Emit event when a asset is selected
  private selectAsset(assetId: string) {
    this.dispatchEvent(new CustomEvent('assetSelect', { detail: { assetId } }));
  }

  // Emit event when a network is selected
  private selectNetwork(network: Network) {
    this.dispatchEvent(new CustomEvent('networkSelect', { detail: { network } }));
  }

  // Emit event to request changing step (for "Back" buttons)
  private changeStep(step: ModalStep, e?: Event) {
    e?.stopPropagation(); // Prevent event bubbling if from a button click
    this.dispatchEvent(new CustomEvent('changeStep', { detail: step }));
  }

  private copyAddress(event: Event) {
    if (!this.paymentAddress) return
    event.stopPropagation();

    navigator.clipboard.writeText(this.paymentAddress);

    this.isAddressCopied = true;
    setTimeout(() => this.isAddressCopied = false, 2000);
  }

  private toggleSandboxPanel(event: Event) {
    event.stopPropagation();
    this.sandboxPanelOpen = !this.sandboxPanelOpen;
  }

  private simulate(outcome: 'success' | 'partial' | 'error' | 'expired', event: Event) {
    event.stopPropagation();
    this.sandboxPanelOpen = false;
    this.dispatchEvent(new CustomEvent('sandboxSimulate', { detail: outcome }));
  }

  private handlePayFromDevice() {
    if (this.paymentUrl) {
      window.open(this.paymentUrl, '_blank');
    }
  }

  private get currentAsset(): Asset | undefined {
    return this.assets.find(asset => asset.id === this.selectedAsset)
  }

  private get currentNetwork(): Network | undefined {
    return this.currentAsset?.networks.find(network => network.id === this.selectedNetwork)
  }

  private getFormattedTimeWindow(): string {
    if (!this.qrCodeExpiresAt || isNaN(this.qrCodeExpiresAt)) return '30 min';

    const endTime = this.qrCodeExpiresAt;
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
      
      /* Estilo Error */
      .error-icon { font-size: 4rem; margin-bottom: 1rem; }

      /* Estilo Processing */
      .processing-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding-top: 1rem;
      }

      /* Animación de puntos */
      .dots-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 40px;
      }

      .dot {
        width: 12px;
        height: 12px;
        background-color: var(--apolo-accent);
        border-radius: 50%;
        display: inline-block;
        animation: dot-pulse 1.5s infinite ease-in-out;
      }

      .dot:nth-child(2) { animation-delay: 0.2s; width: 16px; height: 16px; }
      .dot:nth-child(3) { animation-delay: 0.4s; width: 20px; height: 20px; }
      .dot:nth-child(4) { animation-delay: 0.6s; width: 16px; height: 16px; }
      .dot:nth-child(5) { animation-delay: 0.8s; }

      @keyframes dot-pulse {
        0%, 100% { transform: scale(0.7); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      .processing-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--apolo-primary-darkest);
        margin: 0;
      }

      /* Balance Card */
      .balance-card {
        background-color: #fff7ed; /* Un naranja muy claro de fondo */
        border: 1px dashed var(--apolo-accent);
        border-radius: 12px;
        padding: 0.8rem;
        margin-bottom: 1.5rem;
        animation: slideDown 0.4s ease-out;
      }

      .balance-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
      }

      .balance-row:last-child { margin-bottom: 0; }

      .balance-label { color: #6b7280; }
      .balance-value { font-weight: 700; color: var(--apolo-primary-darkest); }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* --- SANDBOX (TEST MODE) --- */
      /* Floating badge anchored to the dialog itself (see modal-base.ts), pinned */
      /* just inside its top edge so it never takes up layout space nor spills */
      /* outside the card into the backdrop. */
      .sandbox-float-badge {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
      }

      .sandbox-badge {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--apolo-accent);
        background: #fff7ed;
        border: 1px solid var(--apolo-accent);
        border-radius: 999px;
        padding: 0.3rem 0.8rem;
        cursor: default;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .sandbox-cta-wrapper {
        position: relative;
        width: 100%;
      }

      .sandbox-panel {
        position: absolute;
        top: calc(100% + 0.4rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        min-width: 220px;
      }

      .sandbox-panel--up {
        top: auto;
        bottom: calc(100% + 0.4rem);
      }

      .sandbox-panel button {
        text-align: left;
        background: none;
        border: none;
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--apolo-primary-darkest);
        cursor: pointer;
        border-radius: 8px;
      }

      .sandbox-panel button:hover {
        background: #f3f4f6;
      }

      .sandbox-info-banner {
        background-color: #fff7ed;
        border: 1px solid var(--apolo-accent);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .sandbox-info-banner p {
        margin: 0;
        font-size: 0.85rem;
        font-weight: 600;
        color: #9a3412;
        text-align: center;
      }
    `
  ];

  // --- SANDBOX: aviso de datos de prueba, reemplaza el banner "scanApp" ---
  private renderSandboxInfoBanner(t: Dictionary) {
    return html`
      <div class="sandbox-info-banner">
        <p>${unsafeHTML(t.modal.sandbox.qrInfo)}</p>
      </div>
    `;
  }

  // --- SANDBOX: botón "Simular pago" + picker anclado hacia arriba ---
  private renderSandboxAction(t: Dictionary) {
    return html`
      <div class="sandbox-cta-wrapper">
        ${this.sandboxPanelOpen ? html`
          <div class="sandbox-panel sandbox-panel--up">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--apolo-primary-darkest); padding: 0.4rem 0.75rem;">
              ${t.modal.sandbox.title}
            </span>
            <button @click=${(e: Event) => this.simulate('success', e)}>${t.modal.sandbox.actions.success}</button>
            <button @click=${(e: Event) => this.simulate('partial', e)}>${t.modal.sandbox.actions.partial}</button>
            <button @click=${(e: Event) => this.simulate('error', e)}>${t.modal.sandbox.actions.error}</button>
            <button @click=${(e: Event) => this.simulate('expired', e)}>${t.modal.sandbox.actions.expired}</button>
          </div>
        ` : ''}
        <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" @click=${this.toggleSandboxPanel}>
          ${t.modal.sandbox.simulateButton}
        </button>
      </div>
    `;
  }

  // --- Bloque final compartido: en sandbox siempre es el aviso + botón de simular; ---
  // --- en modo real es el banner "scanApp" (solo apolopay) y/o el botón de pagar. ---
  private renderQrFooterActions(t: Dictionary, network: Network | undefined) {
    if (this.isSandbox) {
      return html`
        ${this.renderSandboxInfoBanner(t)}
        ${this.renderSandboxAction(t)}
      `;
    }

    return html`
      ${network && isApoloPayNetwork(network) ? html`<button class="btn-dark">${unsafeHTML(t.modal.actions.scanApp)}</button>` : ''}
      ${this.paymentUrl ? html`
        <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" @click=${this.handlePayFromDevice}>
          ${t.modal.actions.payFromDevice}
        </button>
      ` : ''}
    `;
  }

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
    const symbol = this.currentAsset?.symbol || '';
    const remainingForPay = this.amount - (this.amountPaid || 0);

    const qrImgSrc = this.isSandbox
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t.modal.sandbox.qrPlaceholder)}&ecc=H`
      : this.qrCodeUrl;

    // 1. Caso Apolo Pay
    if (network && isApoloPayNetwork(network)) {
      return html`
        <payment-timer class="timer" .expiresAt=${this.qrCodeExpiresAt} @expired=${this.handleTimerExpired}></payment-timer>

        ${this.amountPaid && this.amountPaid > 0 ? html`
          <div class="balance-card">
            <div class="balance-row">
              <span class="balance-label">${I18n.t.modal.labels.paid}:</span>
              <span class="balance-value">${amountFormatter(this.amountPaid, { symbol, lang: this.lang })}</span>
            </div>
            <div class="balance-row">
              <span class="balance-label">${I18n.t.modal.labels.remainingToPay}:</span>
              <span class="balance-value highlight">${amountFormatter(this.amount, { symbol, lang: this.lang })}</span>
            </div>
          </div>
        ` : ''}

        <div class="qr-frame">
          <div class="qr-wrapper">
            <img src="${qrImgSrc}" class="qr-code-img" alt="QR Apolo Pay" />
            <img src="${logoApolo}" class="qr-overlay-icon" style="padding: 4px;" />
          </div>
          <span class="qr-badge">${amountFormatter(remainingForPay, { symbol, lang: this.lang })}</span>
        </div>

        <div class="btn-dark">
          <h4 style="margin-top: 0; margin-bottom: .1rem;">${unsafeHTML(t.modal.info.noReloadPageTitle)}</h4>
          <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
        </div>

        <div class="warning-text">
          <p>${unsafeHTML(warningTimerHTML)}</p>
        </div>

        ${this.renderQrFooterActions(t, network)}
      `;
    }

    // 2. Caso Red Externa
    return html`
      <payment-timer class="timer" .expiresAt=${this.qrCodeExpiresAt} @expired=${this.handleTimerExpired}></payment-timer>

      ${this.amountPaid && this.amountPaid > 0 ? html`
        <div class="balance-card">
          <div class="balance-row">
            <span class="balance-label">${I18n.t.modal.labels.paid}:</span>
            <span class="balance-value">${amountFormatter(this.amountPaid, { symbol, lang: this.lang })}</span>
          </div>
          <div class="balance-row">
            <span class="balance-label">${I18n.t.modal.labels.remainingToPay}:</span>
            <span class="balance-value highlight">${amountFormatter(this.amount, { symbol, lang: this.lang })}</span>
          </div>
        </div>
      ` : ''}

      <div class="qr-frame">
        <div class="qr-wrapper">
          <img src="${qrImgSrc}" class="qr-code-img" alt="QR Wallet" @error=${handleImageError} />

          ${network
        ? html`<img src="${network.image}" class="qr-overlay-icon" alt="Network Icon" @error=${handleImageError} />`
        : ''
      }
        </div>
        <span class="qr-badge">${amountFormatter(remainingForPay, { symbol, lang: this.lang })}</span>
      </div>

      <div class="btn-dark">
        <h4 style="margin-top: 0; margin-bottom: .1rem;">${unsafeHTML(t.modal.info.noReloadPageTitle)}</h4>
        <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.network}</label>
        <input class="text-field-input" readonly value="${this.currentNetwork?.name}" />
      </div>

      <div class="text-field">
        <label class="text-field-label">${t.modal.labels.address}</label>
        <input class="text-field-input" readonly value="${this.paymentAddress}" @click=${this.copyAddress} />
        ${this.paymentAddress ? html`
          <button class="btn-secondary" @click=${this.copyAddress}>${this.isAddressCopied ? t.modal.actions.copied : t.modal.actions.copy}</button>
        ` : ''}
      </div>

      <div class="warning-text">
        ${!this.isSandbox ? html`
          <ul>
            <li>${unsafeHTML(t.modal.warnings.networkMatch)}</li>
            <li>${unsafeHTML(t.modal.warnings.noNFT)}</li>
            <li>${unsafeHTML(warningTokenHTML)}</li>
          </ul>
        ` : ''}
        <p>${unsafeHTML(warningTimerHTML)}</p>
      </div>

      ${this.renderQrFooterActions(t, network)}
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
          ${t.modal.info.selectNetworkLater}
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
            <div class="selection-card" @click=${() => this.selectNetwork(network)}>
              <img src="${isApoloPayNetwork(network) ? logoApolo : network.image}" class="coin-icon" @error=${handleImageError} />
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
        ${this.productTitle ? html`<p class="subtitle">${this.productTitle}</p>` : ''}
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
              ${t.modal.success.message} ${this.email ? html`<span class="highlight">${this.email}</span>` : ''} ${t.modal.success.message2}
            </p>

            <div class="purchase-details">
              <h3 class="details-title">${t.modal.success.details}</h3>

              ${this.productTitle ? html`
                <div class="text-field">
                  <label class="text-field-label">${t.modal.labels.product}</label>
                  <input class="text-field-input" readonly value=${this.productTitle} />
                </div>
              ` : ''}

              <div class="text-field">
                <label class="text-field-label">${t.modal.labels.amount}</label>
                <input class="text-field-input" readonly value="${amountFormatter(this.amount, { symbol: this.currentAsset?.symbol || '', lang: this.lang })}" />
              </div>
            </div>
          </div>
        `;
      } else if (this.status === 'error') {
        content = html`
          <div class="result-container">
            <div class="error-icon">❌</div>
            <h2 class="result-title">${t.modal.titles.error}</h2>
            <p class="result-desc">${this.error?.message || t.errors.generic}</p>
            <button class="btn-primary" style="width: 100%;" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `;
      } else if (this.status === 'processing') {
        content = html`
          <div class="processing-container">
            <div class="dots-loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>

            <h2 class="processing-title">${unsafeHTML(t.modal.titles.processing)}</h2>

            <div class="btn-dark" style="margin-bottom: 0">
              <h4 style="margin-top: 0; margin-bottom: .1rem;">${unsafeHTML(t.modal.info.noReloadPageTitle)}</h4>
              <span style="font-size: .8rem;">${t.modal.info.noReloadPageSubTitle}</span>
            </div>

            <div class="text-field" style="width: 100%;">
              <label class="text-field-label">${t.modal.labels.amountSent} (${this.currentAsset?.symbol})</label>
              <input class="text-field-input" readonly value="${amountFormatter(this.amount, { symbol: this.currentAsset?.symbol || '', lang: this.lang })}" />
            </div>
          </div>
        </div>
        `;
      } else {
        content = html`
          <div class="result-container">
            <div class="error-icon">⏳</div>
            <h2 class="result-title">${t.modal.titles.idle}</h2>
            <p class="result-desc">${t.modal.subtitles.idle}</p>
            <button class="btn-primary" style="width: 100%;" @click=${this.requestClose}>${t.modal.actions.close}</button>
          </div>
        `;
      }
    }

    const showOverlay =
      this.isLoadingData ||
      (this.currentStep === ModalStep.SHOW_QR && !this.qrCodeUrl)

    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        ${this.isSandbox ? html`
          <div class="sandbox-float-badge">
            <span class="sandbox-badge">${t.modal.sandbox.badge}</span>
          </div>
        ` : ''}
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