import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  I18n,
  ModalStep,
  ApoloPayClient,
  ClientError,
  PaymentService,
  type Locale,
  type QrRequestDetails,
  ClientResponse,
  ClientCode,
  type PartialPaymentResponseData,
  type PaymentResponseData,
  Network,
} from '@apolopay-sdk/core';
import type { ModalStatus } from './types/status.type.js';

// Import child components
import './components/trigger-button.js';
import './components/payment-modal.js';
import { InfoModal } from './components/info-modal.js';
import { termsURL } from './utils/variables.js';


@customElement('apolopay-button')
export class ApoloPayButton extends LitElement {
  // --- Component Properties ---
  @property({ type: Object }) client: ApoloPayClient | undefined = undefined;
  @property({ type: String, attribute: 'process-id' }) processId: string | undefined = undefined;
  @property({ type: String, attribute: 'product-title' }) productTitle?: string = undefined;
  @property({ type: String }) override lang: Locale = 'es';
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
    if (
      changedProperties.has('client') ||
      changedProperties.has('processId')
    ) {
      this.validateConfig();
      if (this.client && this._service === null) {
        this.initService();
      }
      if (this.client && this.processId) {
        this.loadInitialData();
      }
    }
    super.willUpdate(changedProperties);
  }

  // --- Internal State ---
  @state() private isOpen = false; // Controls modal visibility
  @state() private status: ModalStatus = 'idle'; // General status, used for QR generation and final result
  @state() private currentStep: ModalStep = ModalStep.SELECT_ASSET; // Current step in the modal flow
  @state() private selectedAsset: string | null = null; // ID of the chosen asset
  @state() private selectedNetwork: string | null = null; // ID of the chosen blockchain
  @state() private qrCodeUrl: string | null = null; // URL for the QR code image
  @state() private qrCodeExpiresAt: number | null = null; // Expiration time for the QR code
  @state() private paymentAddress: string | null = null; // Wallet address for payment
  @state() private paymentUrl: string | null = null; // Direct link for single-device payment
  @state() private assets: any[] = []; // List fetched from API
  @state() private successResult: ClientResponse | null = null; // Stores final success for dispatch on close
  @state() private error: ClientError | null = null; // Stores error details if something fails
  @state() private isLoadingData = true; // Tracks initial loading of assets/networks
  @state() private amount: number = 0; // Fetched from processId
  @state() private amountPaid?: number | undefined = undefined;
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
    this.validateConfig();
    if (this.client) {
      this.initService();
      if (this.processId) {
        this.loadInitialData(); // Fetch assets and blockchains immediately
      }
    }
  }

  private initService() {
    if (!this.client || this.hasConfigError) return;
    this._service = new PaymentService(this.client);
  }

  get isValidProcessId() {
    if (!this.processId) return false;
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(this.processId);
  }

  private validateConfig() {
    const key = this.client?.getPublicKey();
    const isKeyValid = !!(key && key.startsWith('pk_') && key.length === 35);

    if (this.client && !isKeyValid) {
      console.error(
        `PaymentButton Error: Invalid publicKey "${key}". Must start with "pk_" and be 35 characters long.`
      );
    }

    this.hasConfigError = !this.client || !isKeyValid;
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
      this.error = { code: ClientCode.data_load_error, message: I18n.t.errors.dataLoadError };
    } finally {
      this.isLoadingData = false;
    }
  }

  private resetState() {
    this.currentStep = ModalStep.SELECT_ASSET;
    this.status = 'idle';
    this.error = null;
    this.successResult = null;

    this.selectedAsset = null;
    this.selectedNetwork = null;
    this.qrCodeUrl = null;
    this.paymentAddress = null;
    this.paymentUrl = null;
    this.qrCodeExpiresAt = null;
  }

  // --- Event Handlers (Triggered by Child Components) ---
  // Triggered by <trigger-button> when clicked
  private async handleOpen() {
    this.resetState();

    if (this.hasConfigError || !this.client || !this.processId) {
      console.error('PaymentButton Error: client and process-id are required and must be valid');
      return;
    }

    if (this.loading) return;

    const response = await InfoModal.show({
      title: I18n.t.modal.info.disclaimerTitle,
      subtitle: I18n.t.modal.info.disclaimerSubtitle,
      content: I18n.t.modal.info.disclaimerBody
    })

    if (response !== true) return;

    this.isOpen = true
  }

  // Triggered by <payment-modal> requesting to close (X, backdrop, Escape)
  private handleCloseRequest() {
    this.isOpen = false;
    // Disconnect WebSocket if the user cancels before payment completion
    if (this.currentStep === ModalStep.SHOW_QR && this.status !== 'success' && this.status !== 'error') {
      this._service?.disconnectWebSocket();
    }

    setTimeout(() => this.resetState(), 300);

    // Dispatch final event if it exists
    if (this.successResult) {
      switch (this.successResult.code) {
        case ClientCode.payment_partial:
          this.dispatchEvent(new CustomEvent('partialPayment', { detail: this.successResult }));
          break;

        default:
          this.dispatchEvent(new CustomEvent('success', { detail: this.successResult }));
          break;
      }
    } else if (this.error) {
      switch (this.error.code) {
        case ClientCode.payment_timeout:
          this.dispatchEvent(new CustomEvent('expired', { detail: this.error }));
          break;

        default:
          this.dispatchEvent(new CustomEvent('error', { detail: this.error }));
          break;
      }
    }
  }

  // Triggered by <payment-modal> when an asset is selected
  private handleAssetSelect(event: CustomEvent<{ assetId: string }>) {
    this.selectedAsset = event.detail.assetId;
    this.currentStep = ModalStep.SELECT_NETWORK;
    this.error = null;
  }

  private handleExpired(event: CustomEvent<{ error: ClientError }>) {
    this.error = event.detail.error;
  }

  // Triggered by <payment-modal> when a network is selected
  private async handleInitiatePayment(event: CustomEvent<{ network: Network }>) {
    if (!this.client || !this.processId) return;
    this.selectedNetwork = event.detail.network.id;
    if (!this.selectedAsset || !this.selectedNetwork) return;

    if (event.detail.network.network !== 'apolopay') {
      const response = await InfoModal.show({
        title: I18n.t.modal.info.disclaimerTitle,
        content: I18n.t.modal.info.disclaimerConfirmation.replace('$termsURL', termsURL)
      })
      if (response !== true) return;
    }

    const detail: QrRequestDetails = {
      assetId: this.selectedAsset,
      networkId: this.selectedNetwork
    };

    this.status = 'loading';
    this.currentStep = ModalStep.SHOW_QR;
    this.qrCodeUrl = null;
    this.paymentAddress = null;
    this.error = null;

    try {
      const qrData = await this._service!.fetchQrCodeDetails(detail, {
        processId: this.processId,
        onSuccess: (response: ClientResponse<PaymentResponseData>) => {
          if (!this.isOpen) return;
          this.status = 'processing';
          this.currentStep = ModalStep.RESULT;
          this.successResult = response;

          setTimeout(() => {
            this.status = 'success';
          }, 2000);
        },
        onPartialPayment: (response: ClientResponse<PartialPaymentResponseData>) => {
          if (!this.isOpen) return;
          this.status = 'idle';
          this.currentStep = ModalStep.SHOW_QR;
          this.amount = Number(response.result?.amount || "0")
          this.amountPaid = Number(response.result?.amountPaid || "0")
          this.successResult = response;
        },
        onError: (error: ClientError) => {
          if (!this.isOpen) return;
          this.status = 'error';
          this.error = error;
          this.currentStep = ModalStep.RESULT;
          this.error = error;
        }
      });
      this.qrCodeUrl = qrData.qrCodeUrl;
      this.paymentAddress = qrData.address;
      this.paymentUrl = qrData.paymentUrl || null;
      this.qrCodeExpiresAt = qrData.expiresAtMs;
      this.amount = typeof qrData.amount === 'string' ? parseFloat(qrData.amount) : qrData.amount;
      if (qrData.amountPaid) this.amountPaid = typeof qrData.amountPaid === 'string' ? parseFloat(qrData.amountPaid) : qrData.amountPaid;
      this.status = 'idle';
    } catch (e) {
      const error = e as ClientError
      this.error = error;
      this.status = 'error';

      if (error.code === ClientCode.paymentProcessNotAvailable) {
        this.currentStep = ModalStep.RESULT;
        return
      }

      console.error("Error fetching QR code details:", error);
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
      this.paymentUrl = null;
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
            .loading=${this.loading ||
      (this.isLoadingData && !this.hasConfigError) ||
      !this.isValidProcessId}
            .hasError=${this.hasConfigError}
            ?disabled=${this.disabled ||
      this.hasConfigError ||
      !this.isValidProcessId}
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
        .amountPaid=${this.amountPaid}
        .email=${this.email}
        .qrCodeExpiresAt=${this.qrCodeExpiresAt}
        .paymentUrl=${this.paymentUrl}
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
    'apolopay-button': ApoloPayButton;
  }
}