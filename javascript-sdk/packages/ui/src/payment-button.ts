import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
  PaymentClient,
  type PaymentError,
  type QrRequestDetails,
} from '@payment-button-sdk/core';

// Import child components
import './components/trigger-button.js';
import './components/payment-modal.js';

// Define the steps for clarity
type ModalStep = 'selectAsset' | 'selectNetwork' | 'showQR' | 'result';

@customElement('payment-button')
export class PaymentButton extends LitElement {
  // --- Component Properties (passed as HTML attributes) ---
  @property({ type: String, attribute: 'api-key' }) apiKey = '';
  @property({ type: Number }) amount = 0; // The amount in the base asset
  @property({ type: String }) email = '';
  @property({ type: String }) label?: string = undefined;
  @property({ type: Boolean }) loading: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;

  // --- Internal State ---
  @state() private isOpen = false; // Controls modal visibility
  @state() private status: 'idle' | 'loading' | 'success' | 'error' = 'idle'; // General status, used for QR generation and final result
  @state() private currentStep: ModalStep = 'selectAsset'; // Current step in the modal flow
  @state() private selectedAsset: string | null = null; // ID of the chosen asset
  @state() private selectedNetwork: string | null = null; // ID of the chosen blockchain
  @state() private qrCodeUrl: string | null = null; // URL for the QR code image
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
    this.client = new PaymentClient({
      apiKey: this.apiKey,
      amount: this.amount,
      email: this.email,
      // Callback triggered by WebSocket on successful payment confirmation
      onSuccess: (response) => {
        this.status = 'success';
        this.currentStep = 'result'; // Show the success step in the modal
        this.dispatchEvent(new CustomEvent('success', { detail: response }));
        // WebSocket is disconnected automatically by the client on success
      },
      // Callback triggered by WebSocket on payment error/timeout
      onError: (error) => {
        this.status = 'error';
        this.error = error;
        this.currentStep = 'result'; // Show the error step in the modal
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
        // WebSocket is disconnected automatically by the client on error
      }
    });
    this.loadInitialData(); // Fetch assets and blockchains immediately
  }

  // Called when the component is removed from the DOM
  override disconnectedCallback() {
    super.disconnectedCallback();
    // Ensure WebSocket is disconnected if the component is removed
    this.client?.disconnectWebSocket();
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

  // --- Event Handlers (Triggered by Child Components) ---
  // Triggered by <trigger-button> when clicked
  private handleOpen() {
    this.isOpen = true;
    // Reset state for a fresh flow each time the modal opens
    this.currentStep = 'selectAsset';
    this.selectedAsset = null;
    this.selectedNetwork = null;
    this.qrCodeUrl = null;
    this.paymentAddress = null;
    this.status = 'idle';
    this.error = null;
  }

  // Triggered by <payment-modal> requesting to close (X, backdrop, Escape)
  private handleCloseRequest() {
    this.isOpen = false;
    // Disconnect WebSocket if the user cancels before payment completion
    if (this.currentStep === 'showQR' && this.status !== 'success' && this.status !== 'error') {
      this.client?.disconnectWebSocket();
    }
  }

  // Triggered by <payment-modal> when an asset is selected
  private handleAssetSelect(event: CustomEvent<{ assetId: string }>) {
    this.selectedAsset = event.detail.assetId;
    this.currentStep = 'selectNetwork'; // Move to the next step
    this.error = null; // Clear previous errors
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
    this.currentStep = 'showQR'; // Move to QR step (will show loading initially)
    this.qrCodeUrl = null; // Clear previous QR data
    this.paymentAddress = null;
    this.error = null;

    // 3. Call the core client to fetch QR details (this also connects WebSocket)
    try {
      const qrData = await this.client.fetchQrCodeDetails(detail);
      this.qrCodeUrl = qrData.qrCodeUrl;
      this.paymentAddress = qrData.address;
      this.status = 'idle'; // QR data loaded, waiting for payment via WebSocket
    } catch (e) {
      console.error("Error fetching QR code details:", e);
      this.error = { code: 'QR_FETCH_ERROR', message: (e instanceof Error ? e.message : 'Failed to get payment details.') };
      this.status = 'error'; // Set error status
      // Revert to network selection on QR fetch error to allow retry
      this.currentStep = 'selectNetwork'; 
    }
  }

  // Triggered by <payment-modal> "Back" buttons
  private handleChangeStep(event: CustomEvent<ModalStep>) {
    // Disconnect WebSocket if going back from QR step before completion
    if (this.currentStep === 'showQR' && event.detail !== 'result') {
      this.client?.disconnectWebSocket();
    }
    this.currentStep = event.detail;
    this.status = 'idle'; // Reset status when moving back
    this.error = null;
    // Clear QR data if moving back from the QR step
    if (this.currentStep !== 'showQR'){
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
            .label=${this.label}
            .amount=${this.amount}
            .loading=${this.loading || this.isLoadingData}
            ?disabled=${this.disabled}
          ></trigger-button>
        </slot>
      </div>

      <payment-modal
        ?isOpen=${this.isOpen}
        .currentStep=${this.currentStep}
        .status=${this.status}
        .error=${this.error}
        .isLoadingData=${this.isLoadingData}
        .assets=${this.assets}
        .selectedAsset=${this.selectedAsset}
        .selectedNetwork=${this.selectedNetwork}
        .qrCodeUrl=${this.qrCodeUrl}
        .paymentAddress=${this.paymentAddress}
        .amount=${this.amount}
        @closeRequest=${this.handleCloseRequest}
        @assetSelect=${this.handleAssetSelect}
        @networkSelect=${this.handleInitiatePayment}
        @changeStep=${this.handleChangeStep}
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