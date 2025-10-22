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
type ModalStep = 'selectCoin' | 'selectNetwork' | 'showQR' | 'result';

@customElement('payment-button')
export class PaymentButton extends LitElement {
  // --- Component Properties (passed as HTML attributes) ---
  @property({ type: String, attribute: 'api-key' })
  apiKey = '';

  @property({ type: Number })
  amount = 0; // The amount in the base coin

  // --- Internal State ---
  @state()
  private isOpen = false; // Controls modal visibility

  @state()
  private status: 'idle' | 'loading' | 'success' | 'error' = 'idle'; // General status, used for QR generation and final result

  @state()
  private currentStep: ModalStep = 'selectCoin'; // Current step in the modal flow

  @state()
  private selectedCoinId: string | null = null; // ID of the chosen stablecoin

  @state()
  private selectedChainId: string | null = null; // ID of the chosen blockchain

  @state()
  private qrCodeUrl: string | null = null; // URL for the QR code image

  @state()
  private paymentAddress: string | null = null; // Wallet address for payment

  @state()
  private stablecoins: any[] = []; // List fetched from API

  @state()
  private blockchains: any[] = []; // List fetched from API

  @state()
  private error: PaymentError | null = null; // Stores error details if something fails

  @state()
  private isLoadingData = true; // Tracks initial loading of coins/chains

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
    this.loadInitialData(); // Fetch stablecoins and blockchains immediately
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
      [this.stablecoins, this.blockchains] = await Promise.all([
        this.client.getStableCoins(),
        this.client.getBlockchains()
      ]);
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
    this.currentStep = 'selectCoin';
    this.selectedCoinId = null;
    this.selectedChainId = null;
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

  // Triggered by <payment-modal> when a stablecoin is selected
  private handleCoinSelect(event: CustomEvent<{ coinId: string }>) {
    this.selectedCoinId = event.detail.coinId;
    this.currentStep = 'selectNetwork'; // Move to the next step
    this.error = null; // Clear previous errors
  }

  // Triggered by <payment-modal> when a network is selected
  private async handleInitiatePayment(event: CustomEvent<{ chainId: string }>) {
    this.selectedChainId = event.detail.chainId;
    if (!this.selectedCoinId || !this.selectedChainId) return; // Should not happen

    const details: QrRequestDetails = { 
      coinId: this.selectedCoinId,
      chainId: this.selectedChainId
    };

    // 1. Dispatch custom event before fetching QR data
    this.dispatchEvent(new CustomEvent('generateQr', { detail: details }));

    // 2. Update UI state to show loading for QR
    this.status = 'loading'; // Indicate QR generation is in progress
    this.currentStep = 'showQR'; // Move to QR step (will show loading initially)
    this.qrCodeUrl = null; // Clear previous QR data
    this.paymentAddress = null;
    this.error = null;

    // 3. Call the core client to fetch QR details (this also connects WebSocket)
    try {
      const qrData = await this.client.fetchQrCodeDetails(details);
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
      if(this.currentStep !== 'showQR'){
          this.qrCodeUrl = null;
          this.paymentAddress = null;
      }
  }

  // --- Styles ---
  static override styles = css`
    :host {
      display: inline-block; /* Behaves like a button */
    }
  `;

  // --- Render Method ---
  protected override render() {
    // Renders the trigger button and the modal, passing down all necessary state
    return html`
      <trigger-button
        .status=${this.status} 
        ?disabled=${this.isLoadingData || !this.apiKey} /* Disable if loading initial data or no API key */
        @open=${this.handleOpen}
      >
        <slot></slot> </trigger-button>

      <payment-modal
        ?isOpen=${this.isOpen}
        .currentStep=${this.currentStep}
        .status=${this.status}
        .error=${this.error}
        .isLoadingData=${this.isLoadingData}
        .stablecoins=${this.stablecoins}
        .blockchains=${this.blockchains}
        .selectedCoinId=${this.selectedCoinId}
        .selectedChainId=${this.selectedChainId}
        .qrCodeUrl=${this.qrCodeUrl}
        .paymentAddress=${this.paymentAddress}
        .amount=${this.amount}
        @closeRequest=${this.handleCloseRequest}
        @coinSelect=${this.handleCoinSelect}
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