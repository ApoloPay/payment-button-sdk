import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  I18n,
  ModalStep,
  ApoloPayClient,
  PaymentService,
  type Locale,
  type QrRequestDetails,
  type ClientResponse,
  type ClientError,
} from '@payment-button-sdk/core';

// Import child components
import './components/trigger-button.js';
import './components/payment-modal.js';


@customElement('payment-button')
export class PaymentButton extends LitElement {
  // --- Component Properties ---
  @property({ type: Object }) client: ApoloPayClient | undefined = undefined;
  @property({ type: String, attribute: 'process-id' }) processId: string | undefined = undefined;
  @property({ type: String, attribute: 'product-title' }) productTitle? = undefined;
  @property({ type: String }) lang: Locale = 'es';
  @property({ type: String }) label?: string = undefined;
  @property({ type: Boolean }) loading: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({
    type: Boolean,
    attribute: 'barrier-dismissible',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null) return false;
        return value !== 'false';
      },
      toAttribute: (value: boolean) => value ? '' : null
    }
  }) barrierDismissible: boolean = false;

  // Detectar cambios en propiedades
  override willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('lang')) I18n.setLocale(this.lang);
    if (changedProperties.has('client') && this.client) {
      this.validateClient();
      this.initService();
      this.loadInitialData();
    }
    super.willUpdate(changedProperties);
  }

  // --- Internal State ---
  @state() private isOpen = false; // Controls modal visibility
  @state() private status: 'idle' | 'loading' | 'success' | 'error' = 'idle'; // General status, used for QR generation and final result
  @state() private currentStep: ModalStep = ModalStep.SELECT_ASSET; // Current step in the modal flow
  @state() private selectedAsset: string | null = null; // ID of the chosen asset
  @state() private selectedNetwork: string | null = null; // ID of the chosen blockchain
  @state() private qrCodeUrl: string | null = null; // URL for the QR code image
  @state() private qrCodeExpiresAt: number | null = null; // Expiration time for the QR code
  @state() private paymentAddress: string | null = null; // Wallet address for payment
  @state() private assets: any[] = []; // List fetched from API
  @state() private error: ClientError | null = null; // Stores error details if something fails
  @state() private isLoadingData = true; // Tracks initial loading of assets/networks
  @state() private amount: number = 0; // Fetched from processId
  @state() private hasConfigError = false; // Invalid publicKey or missing client
  @state() private email: string | null = null; // TODO set email from socket response
  @state() private _service: PaymentService | null = null; // Internal business logic manager

  // --- API Client Instance ---
  // If the 'client' property is not provided, the component might fail.
  // We no longer manage the client instance internally.

  // --- Lifecycle Methods ---
  // Called when the component is added to the DOM
  override connectedCallback() {
    super.connectedCallback();
    if (this.client) {
      this.validateClient();
      this.initService();
      this.loadInitialData(); // Fetch assets and blockchains immediately
    } else {
      this.hasConfigError = true;
    }
  }

  private initService() {
    if (!this.client || this.hasConfigError) return;
    this._service = new PaymentService(this.client);
  }

  private validateClient() {
    const key = this.client?.getPublicKey();
    const isValid = key && key.startsWith('pk_') && key.length === 35;

    if (!isValid) {
      console.error(`PaymentButton Error: Invalid publicKey "${key}". Must start with "pk_" and be 35 characters long.`);
      this.hasConfigError = true;
    } else {
      this.hasConfigError = false;
    }
  }

  // Called when the component is removed from the DOM
  override disconnectedCallback() {
    super.disconnectedCallback();
    // Ensure WebSocket is disconnected if the component is removed
    this._service?.disconnectWebSocket();
  }

  // Replaced by external client initialization

  // --- Data Loading ---
  async loadInitialData() {
    if (!this._service) return;
    this.isLoadingData = true;
    this.error = null;
    if (!this.processId) return;
    try {
      this.assets = await this._service.getAssets();
    } catch (e) {
      console.error('Error loading initial payment options:', e);
      this.error = { code: 'DATA_LOAD_ERROR', message: 'Could not load payment options.' };
    } finally {
      this.isLoadingData = false;
    }
  }

  private resetState() {
    this.currentStep = ModalStep.SELECT_ASSET;
    this.status = 'idle';
    this.error = null;

    this.selectedAsset = null;
    this.selectedNetwork = null;
    this.qrCodeUrl = null;
    this.paymentAddress = null;
    this.qrCodeExpiresAt = null;
  }

  // --- Event Handlers (Triggered by Child Components) ---
  // Triggered by <trigger-button> when clicked
  private handleOpen() {
    this.resetState();

    if (!this.client || !this.processId) {
      console.error('PaymentButton Error: client and process-id are required');
      return;
    }

    if (this.loading) return;

    this.isOpen = true;
  }

  // Triggered by <payment-modal> requesting to close (X, backdrop, Escape)
  private handleCloseRequest() {
    this.isOpen = false;
    // Disconnect WebSocket if the user cancels before payment completion
    if (this.currentStep === ModalStep.SHOW_QR && this.status !== 'success' && this.status !== 'error') {
      this._service?.disconnectWebSocket();
    }

    setTimeout(() => this.resetState(), 300);
  }

  // Triggered by <payment-modal> when an asset is selected
  private handleAssetSelect(event: CustomEvent<{ assetId: string }>) {
    this.selectedAsset = event.detail.assetId;
    this.currentStep = ModalStep.SELECT_NETWORK;
    this.error = null;
  }

  private handleExpired(event: CustomEvent<{ error: { code: string; message: string } }>) {
    this.dispatchEvent(new CustomEvent('error', { detail: event.detail.error }));
  }

  // Triggered by <payment-modal> when a network is selected
  private async handleInitiatePayment(event: CustomEvent<{ networkId: string }>) {
    if (!this.client || !this.processId) return;
    this.selectedNetwork = event.detail.networkId;
    if (!this.selectedAsset || !this.selectedNetwork) return;

    const detail: QrRequestDetails = {
      assetId: this.selectedAsset,
      networkId: this.selectedNetwork
    };

    this.dispatchEvent(new CustomEvent('generateQr', { detail }));

    this.status = 'loading';
    this.currentStep = ModalStep.SHOW_QR;
    this.qrCodeUrl = null;
    this.paymentAddress = null;
    this.error = null;

    try {
      const qrData = await this._service!.fetchQrCodeDetails(detail, {
        processId: this.processId,
        onSuccess: (response: ClientResponse) => {
          if (!this.isOpen) return;
          this.status = 'success';
          this.currentStep = ModalStep.RESULT;
          this.dispatchEvent(new CustomEvent('success', { detail: response }));
        },
        onError: (error: ClientError) => {
          if (!this.isOpen) return;
          this.status = 'error';
          this.error = error;
          this.currentStep = ModalStep.RESULT;
          this.dispatchEvent(new CustomEvent('error', { detail: error }));
        }
      });
      this.qrCodeUrl = qrData.qrCodeUrl;
      this.paymentAddress = qrData.address;
      this.qrCodeExpiresAt = qrData.expiresAtMs;
      this.amount = typeof qrData.amount === 'string' ? parseFloat(qrData.amount) : qrData.amount;
      this.status = 'idle';
    } catch (e) {
      console.error("Error fetching QR code details:", e);
      this.error = { code: 'QR_FETCH_ERROR', message: (e instanceof Error ? e.message : 'Failed to get payment details.') };
      this.status = 'error';
      this.currentStep = ModalStep.SELECT_NETWORK;
    }
  }

  // Triggered by <payment-modal> "Back" buttons
  private handleChangeStep(event: CustomEvent<ModalStep>) {
    // Disconnect WebSocket if going back from QR step before completion
    if (this.currentStep === ModalStep.SHOW_QR && event.detail !== ModalStep.RESULT) {
      this._service?.disconnectWebSocket();
    }
    this.currentStep = event.detail;
    this.status = 'idle'; // Reset status when moving back
    this.error = null;
    // Clear QR data if moving back from the QR step
    if (this.currentStep !== ModalStep.SHOW_QR) {
      this.qrCodeUrl = null;
      this.paymentAddress = null;
    }
  }

  // --- Styles ---
  static override styles = css`
    :host {
      display: inline-block;
    }

    #trigger-wrapper {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }
  `;

  // --- Render Method ---
  protected override render() {
    // Renders the trigger button and the modal, passing down all necessary state
    return html`
      <div id="trigger-wrapper" @click=${this.handleOpen}>
        <slot>
          <trigger-button 
            .lang=${this.lang}
            .label=${this.label}
            .loading=${this.loading || this.isLoadingData}
            .hasError=${this.hasConfigError}
            ?disabled=${this.disabled}
          ></trigger-button>
        </slot>
      </div>

      <payment-modal
        ?isOpen=${this.isOpen}
        .barrierDismissible=${this.barrierDismissible}
        .lang=${this.lang}
        .currentStep=${this.currentStep}
        .status=${this.status}
        .productTitle=${this.productTitle}
        .error=${this.error}
        .isLoadingData=${this.isLoadingData}
        .assets=${this.assets}
        .selectedAsset=${this.selectedAsset}
        .selectedNetwork=${this.selectedNetwork}
        .qrCodeUrl=${this.qrCodeUrl}
        .paymentAddress=${this.paymentAddress}
        .amount=${this.amount}
        .email=${this.email}
        .qrCodeExpiresAt=${this.qrCodeExpiresAt}
        @closeRequest=${this.handleCloseRequest}
        @assetSelect=${this.handleAssetSelect}
        @networkSelect=${this.handleInitiatePayment}
        @changeStep=${this.handleChangeStep}
        @expired=${this.handleExpired}
      ></payment-modal>
    `;
  }
}

// Global type declaration for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'payment-button': PaymentButton;
  }
}