import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { I18n, type Locale } from '@payment-button-sdk/core';

import {
  ModalStep,
  PaymentClient,
  type PaymentError,
  type QrRequestDetails,
} from '@payment-button-sdk/core';

// Import child components
import './components/trigger-button.js';
import './components/payment-modal.js';


@customElement('payment-button')
export class PaymentButton extends LitElement {
  // --- Component Properties (passed as HTML attributes) ---
  @property({ type: String, attribute: 'api-key' }) apiKey: string = '';
  @property({ type: Number }) amount: number = 0; // The amount in the base asset
  @property({ type: String }) email: string = '';
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
    super.willUpdate(changedProperties);
  }

  // --- Internal State ---
  @state() private isOpen = false; // Controls modal visibility
  @state() private status: 'idle' | 'loading' | 'success' | 'error' = 'idle'; // General status, used for QR generation and final result
  @state() private currentStep: ModalStep = ModalStep.SELECT_ASSET; // Current step in the modal flow
  @state() private selectedAsset: string | null = null; // ID of the chosen asset
  @state() private selectedNetwork: string | null = null; // ID of the chosen blockchain
  @state() private qrCodeUrl: string | null = null; // URL for the QR code image
  @state() private qrCodeExpiresAt: string | null = null; // Expiration time for the QR code
  @state() private paymentAddress: string | null = null; // Wallet address for payment
  @state() private assets: any[] = []; // List fetched from API
  @state() private error: PaymentError | null = null; // Stores error details if something fails
  @state() private isLoadingData = true; // Tracks initial loading of assets/networks

  // --- API Client Instance ---
  private client!: PaymentClient;

  // --- Lifecycle Methods ---
  // Called when the component is added to the DOM
  override connectedCallback() {
    super.connectedCallback();
    if (!this.apiKey) {
      console.error('PaymentButton: "api-key" attribute is required.');
      return;
    }
    // Initialize the PaymentClient with necessary options and callbacks
    this.initClient();
    this.loadInitialData(); // Fetch assets and blockchains immediately
  }

  // Called when the component is removed from the DOM
  override disconnectedCallback() {
    super.disconnectedCallback();
    // Ensure WebSocket is disconnected if the component is removed
    this.client?.disconnectWebSocket();
  }

  private initClient() {
    this.client = new PaymentClient({
      apiKey: this.apiKey,
      amount: this.amount,
      email: this.email,
      // Callback triggered by WebSocket on successful payment confirmation
      onSuccess: (response) => {
        this.status = 'success';
        this.currentStep = ModalStep.RESULT; // Show the success step in the modal
        this.dispatchEvent(new CustomEvent('success', { detail: response }));
        // WebSocket is disconnected automatically by the client on success
      },
      // Callback triggered by WebSocket on payment error/timeout
      onError: (error) => {
        this.status = 'error';
        this.error = error;
        this.currentStep = ModalStep.RESULT; // Show the error step in the modal
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
        // WebSocket is disconnected automatically by the client on error
      }
    })
  }

  // --- Data Loading ---
  async loadInitialData() {
    this.isLoadingData = true;
    this.error = null;
    try {
      this.assets = await this.client.getAssets();
    } catch (e) {
      console.error('Error loading initial payment options:', e);
      this.error = { code: 'DATA_LOAD_ERROR', message: 'Could not load payment options.' };
      // Keep loading as false, but error state will indicate failure
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
    // 1. Limpieza preventiva
    this.resetState();

    if (!this.apiKey) return console.error('PaymentButton Error: API Key missing');

    if (this.loading) return;

    if (!this.client) this.initClient();

    this.isOpen = true;
  }

  // Triggered by <payment-modal> requesting to close (X, backdrop, Escape)
  private handleCloseRequest() {
    this.isOpen = false;
    // Disconnect WebSocket if the user cancels before payment completion
    if (this.currentStep === ModalStep.SHOW_QR && this.status !== 'success' && this.status !== 'error') {
      this.client?.disconnectWebSocket();
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
    this.selectedNetwork = event.detail.networkId;
    if (!this.selectedAsset || !this.selectedNetwork) return; // Should not happen

    const detail: QrRequestDetails = {
      assetId: this.selectedAsset,
      networkId: this.selectedNetwork
    };

    // 1. Dispatch custom event before fetching QR data
    this.dispatchEvent(new CustomEvent('generateQr', { detail }));

    // 2. Update UI state to show loading for QR
    this.status = 'loading'; // Indicate QR generation is in progress
    this.currentStep = ModalStep.SHOW_QR; // Move to QR step (will show loading initially)
    this.qrCodeUrl = null; // Clear previous QR data
    this.paymentAddress = null;
    this.error = null;

    // 3. Call the core client to fetch QR details (this also connects WebSocket)
    try {
      const qrData = await this.client.fetchQrCodeDetails(detail);
      this.qrCodeUrl = qrData.qrCodeUrl;
      this.paymentAddress = qrData.address;
      this.qrCodeExpiresAt = qrData.expiresAt;
      this.status = 'idle'; // QR data loaded, waiting for payment via WebSocket
    } catch (e) {
      console.error("Error fetching QR code details:", e);
      this.error = { code: 'QR_FETCH_ERROR', message: (e instanceof Error ? e.message : 'Failed to get payment details.') };
      this.status = 'error'; // Set error status
      // Revert to network selection on QR fetch error to allow retry
      this.currentStep = ModalStep.SELECT_NETWORK;
    }
  }

  // Triggered by <payment-modal> "Back" buttons
  private handleChangeStep(event: CustomEvent<ModalStep>) {
    // Disconnect WebSocket if going back from QR step before completion
    if (this.currentStep === ModalStep.SHOW_QR && event.detail !== ModalStep.RESULT) {
      this.client?.disconnectWebSocket();
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
            .amount=${this.amount}
            .loading=${this.loading || this.isLoadingData}
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