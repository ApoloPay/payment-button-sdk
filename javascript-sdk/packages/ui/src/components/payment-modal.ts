import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { PaymentError } from '@payment-button-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';
import { spinnerStyles } from '../styles/spinner';

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

  // Emit event when Apolo network is selected
  private selectApoloNetwork() {
    this.dispatchEvent(new CustomEvent('apoloNetworkSelect', { detail: { chainId: 'apolopay' } }));
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
  static override styles = [
    sharedStyles,
    modalBaseStyles,
    spinnerStyles,
    css`
      /* Layout interno del modal */
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--apolo-border);
      }

      .modal-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--apolo-text);
      }

      .modal-body { 
        padding: 1.5rem; 
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--apolo-text-muted);
        transition: color 0.2s;
        padding: 0;
      }
      .close-button:hover {
        color: var(--apolo-text);
      }

      /* Listas de Selección (Monedas/Redes) */
      .selection-list { display: grid; gap: 1rem; margin: 1.5rem 0; }
      
      .selection-item {
        display: flex;
        align-items: center;
        padding: 0.8rem 1rem;
        border: 1px solid var(--apolo-border);
        border-radius: var(--apolo-radius);
        cursor: pointer;
        background-color: var(--apolo-bg);
        text-align: left;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        color: var(--apolo-text);
      }
      
      .selection-item:hover { 
        border-color: var(--apolo-primary); 
        background-color: #f9fafb; /* Podrías usar var(--apolo-bg-hover) */
      }
      
      .selection-item.selected {
        border-color: var(--apolo-primary);
        box-shadow: 0 0 0 2px var(--apolo-primary-hover);
      }
      
      .selection-item img { width: 28px; height: 28px; margin-right: 1rem; border-radius: 50%; }
      .selection-item span { font-weight: 500; }

      .footer-note { font-size: 0.85rem; color: var(--apolo-text-muted); text-align: center; margin-top: 1rem; }

      /* QR y Resultados */
      .qr-code-container { text-align: center; margin: 1.5rem 0; }
      .qr-code-container img { display: block; margin: 1rem auto; border: 1px solid var(--apolo-border); border-radius: 4px; }
      .qr-code-container code {
        display: block;
        background-color: #f3f4f6;
        color: var(--apolo-text);
        padding: 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        word-break: break-all;
        margin-top: 0.5rem;
        font-size: 0.9rem;
      }

      .result-icon { font-size: 3rem; margin-bottom: 1rem; }
      .result-message { text-align: center; }
      .result-message h2 { margin-bottom: 0.5rem; color: var(--apolo-text); }
      .result-message p { color: var(--apolo-text-muted); margin-bottom: 1.5rem; }

      /* Botones de Acción */
      .action-button {
        padding: 0.6rem 1rem;
        border-radius: 6px;
        border: 1px solid var(--apolo-border);
        background-color: transparent;
        color: var(--apolo-text);
        cursor: pointer;
        margin-right: 0.5rem;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      .action-button:hover { background-color: #f3f4f6; }

      .primary-button {
        padding: 0.8rem 1.2rem;
        border-radius: var(--apolo-radius);
        border: none;
        background-color: var(--apolo-primary);
        color: var(--apolo-on-primary);
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        margin-top: 1rem;
        transition: opacity 0.2s;
      }
      .primary-button:hover { opacity: 0.9; }
    `
  ];

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
                  <button
                    class="selection-item ${this.selectedChainId === 'apolopay' ? 'selected' : ''}"
                    @click=${this.selectApoloNetwork}
                  >
                    <span>Apolo Pay</span>
                  </button>
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