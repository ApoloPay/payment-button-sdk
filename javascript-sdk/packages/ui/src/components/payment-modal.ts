import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { PaymentError } from '@payment-button-sdk/core';

// Define step types, ensure consistency with the parent
type ModalStep = 'selectCoin' | 'selectNetwork' | 'showQR' | 'result';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props Received from Parent ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String }) currentStep: ModalStep = 'selectCoin';
  @property({ type: String }) status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  @property({ type: Object }) error: PaymentError | null = null;
  @property({ type: Boolean }) isLoadingData = true; // For initial coin/chain load
  @property({ type: Array }) stablecoins: any[] = [];
  @property({ type: Array }) blockchains: any[] = [];
  @property({ type: String }) selectedCoinId: string | null = null;
  @property({ type: String }) selectedChainId: string | null = null;
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
    if (this.status === 'loading' && this.currentStep === 'result') return;
    this.dispatchEvent(new CustomEvent('closeRequest'));
  }

  // Handle clicks potentially on the backdrop
  private handleBackdropClick = (event: MouseEvent) => {
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

  // Emit event when a coin is selected
  private selectCoin(coinId: string) {
    this.dispatchEvent(new CustomEvent('coinSelect', { detail: { coinId } }));
  }

  // Emit event when a network is selected
  private selectNetwork(chainId: string) {
    this.dispatchEvent(new CustomEvent('networkSelect', { detail: { chainId } }));
  }

  // Emit event to request changing step (for "Back" buttons)
  private changeStep(step: ModalStep, e?: Event) {
      e?.stopPropagation(); // Prevent event bubbling if from a button click
      this.dispatchEvent(new CustomEvent('changeStep', { detail: step }));
  }

  // --- Styles ---
  static override styles = css`
    :host { display: block; } /* Or potentially remove if parent handles layout */

    dialog {
      border: none;
      border-radius: 12px; /* Smoother corners */
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      padding: 0; /* Remove padding, handle inside */
      min-width: 320px;
      max-width: 400px; /* Limit width */
      overflow: hidden; /* Prevent content overflow during animations */

      /* Animations */
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      transition: opacity 0.2s ease-out, transform 0.2s ease-out, overlay 0.2s ease-out allow-discrete;
      display: none; /* Initially hidden */
    }

    dialog[open] {
      opacity: 1;
      transform: scale(1) translateY(0);
      display: block; /* Show when open */
    }

    @starting-style {
      dialog[open] {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
    }

    dialog.closing {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }

    /* Backdrop */
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
      transition: background-color 0.2s ease-out, backdrop-filter 0.2s ease-out, overlay 0.2s ease-out allow-discrete;
      display: none; /* Initially hidden */
    }

    dialog[open]::backdrop {
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: block; /* Show when open */
    }
     @starting-style {
       dialog[open]::backdrop {
         background-color: rgba(0, 0, 0, 0);
         backdrop-filter: blur(0px);
       }
    }

    dialog.closing::backdrop {
      background-color: rgba(0, 0, 0, 0);
       backdrop-filter: blur(0px);
    }

    /* Modal Layout */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
    }
    .modal-header h3 { margin: 0; font-size: 1.1rem; }
    .modal-body { padding: 1.5rem; }
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      color: #888;
    }
    .close-button:hover { color: #333; }

    /* Selection List Styles (Matches images) */
    .selection-list { display: grid; gap: 1rem; margin: 1.5rem 0; }
    .selection-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      background-color: #fff;
      text-align: left;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .selection-item:hover { border-color: #a5b4fc; } /* Lighter focus color */
    .selection-item.selected {
      border-color: #6366f1; /* Brand color */
      box-shadow: 0 0 0 2px #a5b4fc;
    }
     .selection-item img { width: 28px; height: 28px; margin-right: 1rem; border-radius: 50%; }
     .selection-item span { font-weight: 500; } /* Make text slightly bolder */
     
    .footer-note { font-size: 0.85rem; color: #6b7280; text-align: center; margin-top: 1rem; }
    
    /* QR Code Styles */
     .qr-code-container { text-align: center; margin: 1.5rem 0; }
     .qr-code-container img { display: block; margin: 1rem auto; border: 1px solid #eee; border-radius: 4px; }
     .qr-code-container code {
       display: block;
       background-color: #f3f4f6;
       padding: 0.5rem;
       border-radius: 4px;
       font-family: monospace;
       word-break: break-all; /* Wrap long addresses */
       margin-top: 0.5rem;
     }

    /* Result Styles */
    .result-icon { font-size: 3rem; margin-bottom: 1rem; } /* Placeholder for checkmark/error icon */
    .result-message h2 { margin-bottom: 0.5rem; }
    .result-message p { color: #6b7280; margin-bottom: 1.5rem; }

    /* Generic Button Styles (Back, Retry, Close in result) */
    .action-button {
        padding: 0.6rem 1rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        background-color: #f9fafb;
        cursor: pointer;
        margin-right: 0.5rem; /* Spacing between buttons */
        font-weight: 500;
    }
    .action-button:hover { background-color: #f3f4f6; }
    .primary-button { /* For Confirm Payment button */
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        border: none;
        background-color: #6366f1; /* Brand color */
        color: white;
        cursor: pointer;
        font-weight: 600;
        width: 100%; /* Make confirm button full width */
        margin-top: 1rem;
    }
    .primary-button:disabled { background-color: #a5b4fc; cursor: not-allowed; }

    /* Loading Indicators */
    .loading-indicator { text-align: center; padding: 2rem 0; color: #6b7280; }
    .spinner { /* Basic spinner example, replace with your preferred one */
      border: 4px solid #f3f4f6;
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;

  // --- Render Method ---
  protected override render() {
    let stepContent;

    // Show loading indicator if initial data isn't ready for selection steps
    if (this.isLoadingData && (this.currentStep === 'selectCoin' || this.currentStep === 'selectNetwork')) {
      stepContent = html`<div class="loading-indicator">Cargando opciones...<div class="spinner"></div></div>`;
    } else {
      // --- Render content based on the current step ---
      switch (this.currentStep) {
        case 'selectCoin':
          if (!this.stablecoins || this.stablecoins.length === 0) {
            stepContent = html`<p>No hay stablecoins disponibles en este momento.</p>`;
          } else {
            stepContent = html`
              <h2>Selecciona la <span style="color: #6366f1;">stablecoin</span></h2>
              <p>Selecciona la stablecoin con la que deseas pagar.</p>
              <div class="selection-list">
                ${this.stablecoins.map(coin => html`
                  <button
                    class="selection-item ${this.selectedCoinId === coin.id ? 'selected' : ''}"
                    @click=${() => this.selectCoin(coin.id)}
                  >
                    <span>${coin.name} (${coin.symbol})</span>
                  </button>
                `)}
              </div>
              <p class="footer-note">Luego podrás seleccionar la red de tu preferencia</p>
            `;
          }
          break; // End selectCoin

        case 'selectNetwork':
           if (!this.blockchains || this.blockchains.length === 0) {
              stepContent = html`
                <p>No hay redes disponibles para esta moneda.</p>
                <button class="action-button" @click=${(e: Event) => this.changeStep('selectCoin', e)}>Volver</button>
              `;
           } else {
              stepContent = html`
                <h2>Selecciona la <span style="color: #6366f1;">red</span></h2>
                <p>Selecciona la red de tu preferencia.</p>
                <div class="selection-list">
                   ${this.blockchains.map(chain => html`
                    <button
                      class="selection-item ${this.selectedChainId === chain.id ? 'selected' : ''}"
                      @click=${() => this.selectNetwork(chain.id)}
                    >
                      <span>${chain.name}</span>
                    </button>
                  `)}
                </div>
                <button class="action-button" @click=${(e: Event) => this.changeStep('selectCoin', e)}>Volver</button>
              `;
           }
          break; // End selectNetwork

        case 'showQR':
          // Show loading spinner if status is 'loading' (QR generation)
          if (this.status === 'loading') {
             stepContent = html`<div class="loading-indicator">Generando código QR...<div class="spinner"></div></div>`;
          } else if (this.qrCodeUrl) {
            // Show QR code and address
            stepContent = html`
              <h2>Escanea para Pagar</h2>
              <p>Envía ${this.amount} (${this.selectedCoinId}) usando la red ${this.selectedChainId}.</p>
              <div class="qr-code-container">
                  <img src=${this.qrCodeUrl} alt="Código QR de pago" />
                  <p>O envía manualmente a:</p>
                  <code>${this.paymentAddress}</code>
                  </div>
              <p class="footer-note">Esperando confirmación del pago...</p>
              <button class="action-button" @click=${(e: Event) => this.changeStep('selectNetwork', e)}>Volver</button>
              `;
          } else {
             // Show error if QR generation failed (error prop should be set)
             stepContent = html`
                <h2>Error</h2>
                <p>${this.error?.message || 'No se pudo generar la información de pago.'}</p>
                <button class="action-button" @click=${(e: Event) => this.changeStep('selectNetwork', e)}>Volver</button>
             `;
          }
          break; // End showQR

        case 'result':
          // Display final success or error message
          if (this.status === 'success') {
            stepContent = html`
                <div class="result-message" style="text-align: center;">
                  <div class="result-icon">✅</div> <h2>¡Pago Exitoso!</h2>
                  <p>Tu pago ha sido confirmado correctamente.</p>
                  <button class="primary-button" @click=${this.requestClose}>Cerrar</button>
                </div>
            `;
          } else if (this.status === 'error') {
            stepContent = html`
                <div class="result-message" style="text-align: center;">
                   <div class="result-icon">❌</div> <h2>Error en el Pago</h2>
                   <p>${this.error?.message || 'Ocurrió un error inesperado durante el pago.'}</p>
                   <button class="action-button" @click=${this.requestClose}>Cerrar</button>
                </div>
            `;
          } else {
             // Intermediate state while waiting for WebSocket confirmation (optional)
            stepContent = html`<div class="loading-indicator">Verificando pago...<div class="spinner"></div></div>`;
          }
          break; // End result
      } // End switch
    } // End else (isLoadingData)

    // Final Render of the dialog shell
    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        <div class="modal-header">
          <h3>Realizar Pago</h3>
          <button @click=${this.requestClose} class="close-button" aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body">
          ${stepContent}
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