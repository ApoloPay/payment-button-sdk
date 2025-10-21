import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { PaymentError } from '@payment-button-sdk/core';

// Definir los posibles pasos
type ModalStep = 'selectCoin' | 'selectNetwork' | 'showQR' | 'result';

@customElement('payment-modal')
export class PaymentModal extends LitElement {
  // --- Props recibidos del padre ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String }) status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  @property({ type: Object }) error: PaymentError | null = null;
  @property({ type: Array }) stablecoins: any[] = [];
  @property({ type: Array }) blockchains: any[] = [];
  @property({ type: Number }) amount = 0;
  @property({ type: String }) currency = 'USD';

  // --- Estado interno (añadimos 'step' y selecciones) ---
  @state() private selectedCoinId: string | null = null; // Guardamos el ID
  @state() private selectedChainId: string | null = null; // Guardamos el ID
  @state() private currentStep: ModalStep = 'selectCoin'; // Empezamos en el primer paso

  // --- QR Code State (Placeholder - Necesitarás datos de tu API) ---
  @state() private qrCodeUrl: string | null = null; 
  @state() private paymentAddress: string | null = null;

  @query('dialog') private dialogElement!: HTMLDialogElement;

  // --- Nuevos Métodos para Navegación ---
  private goToStep(step: ModalStep) {
    this.currentStep = step;
  }

  private handleCoinSelected(coinId: string) {
    this.selectedCoinId = coinId;
    this.goToStep('selectNetwork'); // Avanza al siguiente paso
  }

  private handleNetworkSelected(chainId: string) {
    this.selectedChainId = chainId;
    // AQUÍ es donde probablemente llamarías a tu API para generar el QR
    this.generateQrCode(); 
    this.goToStep('showQR'); // Avanza al paso del QR
  }

  // Placeholder - Reemplaza con tu lógica real de API
  private async generateQrCode() {
      // Simulación: Llama a tu backend con this.selectedCoinId y this.selectedChainId
      console.log(`Generando QR para ${this.selectedCoinId} en ${this.selectedChainId}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula espera
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagoSimulado_${Date.now()}`; // URL de ejemplo
      this.paymentAddress = `0xSimulatedAddress${Date.now().toString().slice(-4)}`; // Dirección de ejemplo
  }

  // --- Simpler updated() ---
  // We'll manage the .closing class here
  override async updated(changedProperties: Map<string | number | symbol, unknown>) {
    await this.updateComplete; 
    
    if (changedProperties.has('isOpen')) {
      const dialog = this.dialogElement;
      if (!dialog) return; 

      if (this.isOpen) {
        // --- AL ABRIR ---
        dialog.classList.remove('closing'); 
        
        // Check if the dialog isn't already open before calling showModal
        // This prevents errors if state updates quickly
        if (!dialog.open) {
            dialog.showModal(); 
        }

        // --- ¡EL ARREGLO! ---
        // Espera un microtask antes de añadir el listener.
        // Esto evita que el clic que abrió el modal lo cierre inmediatamente.
        setTimeout(() => {
          if (this.isOpen && dialog.open) { // Re-check state in case it closed fast
             dialog.addEventListener('click', this.handleBackdropClick);
          }
        }, 0);

        // Initialize selects if needed
        if (!this.selectedCoinId && this.stablecoins.length > 0) this.selectedCoinId = this.stablecoins[0].id;
        if (!this.selectedChainId && this.blockchains.length > 0) this.selectedChainId = this.blockchains[0].id;
      } else {
        // --- AL CERRAR ---
        dialog.removeEventListener('click', this.handleBackdropClick); // Quita el listener *antes* de animar
        dialog.classList.add('closing');

        dialog.addEventListener('transitionend', () => {
             // Llama a close() DESPUÉS de la animación
             // Verifica que siga cerrado antes de llamar a close()
             if(!this.isOpen) { 
                 dialog.close();
             }
             dialog.classList.remove('closing');
        }, { once: true }); 
      }
    }
  }

  // Just tells the parent to set isOpen = false
  private handleClose() {
    this.goToStep('selectCoin');
    this.dispatchEvent(new CustomEvent('close'));
  }

  private handleBackdropClick = (event: MouseEvent) => {
    const rect = this.dialogElement.getBoundingClientRect();
    const clickedOutside = (
      event.clientY < rect.top || event.clientY > rect.bottom ||
      event.clientX < rect.left || event.clientX > rect.right
    );
    if (clickedOutside) {
      this.handleClose();
    }
  }

  // --- handleConfirm (AHORA es el paso final del QR) ---
  // Este método ya no se llama desde un botón "Confirmar" general,
  // sino que se activa cuando el pago se completa (quizás por WebSocket o polling)
  // O si tienes un botón "Ya pagué" en el paso del QR.
  // Por ahora, lo dejaremos como estaba, pero su propósito cambia.
  // private handleConfirm() {
  //   if (!this.selectedCoinId || !this.selectedChainId) return;

  //   const details: PaymentDetails = {
  //     stablecoin: this.selectedCoinId,
  //     blockchain: this.selectedChainId,
  //   };
  //   // Despachamos 'confirm' cuando el pago está listo para ser verificado
  //   // o ya fue verificado por el backend.
  //   this.dispatchEvent(new CustomEvent('confirm', { detail: details })); 
  //   // Podrías ir al paso 'result' aquí si el backend confirma.
  // }
  
  // Handler specifically for the dialog's native close event (Escape key)
  private handleDialogNativeClose(event: Event) {
      // Prevent the default immediate close if triggered by Escape
      event.preventDefault();
      // Only trigger our animated close if it's not already closing
      if (!this.dialogElement.classList.contains('closing')) {
          this.handleClose();
      }
  }

  // --- Estilos ---
  static override styles = css`
    dialog {
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 1.5rem;
      min-width: 300px;

      /* Animación de entrada */
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.2s ease-out, transform 0.2s ease-out, display 0.2s allow-discrete;

      /* Estilo cuando está abierto */
      &[open] {
        opacity: 1;
        transform: scale(1);
      }

      /* Estilo para cuando está cerrando */
      &.closing {
        opacity: 0;
        transform: scale(0.95);
      }

      /* Estilos para navegadores que soportan starting-style (mejora la animación de entrada) */
      @starting-style {
        &[open] {
          opacity: 0;
          transform: scale(0.95);
        }
      }
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);

      /* Animación del fondo */
      background-color: rgba(0, 0, 0, 0);
      transition: background-color 0.2s ease-out, display 0.2s allow-discrete;

      /* Estilo cuando está abierto */
      dialog[open]::backdrop {
         background-color: rgba(0, 0, 0, 0.5);
      }

      /* Estilo para backdrop cerrando */
      dialog.closing::backdrop {
        background-color: rgba(0, 0, 0, 0);
      }

       /* Estilos para navegadores que soportan starting-style */
      @starting-style {
         dialog[open]::backdrop {
           background-color: rgba(0, 0, 0, 0);
         }
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }


    .modal-body {
      padding-top: 1rem;
    }
    .selection-list {
      display: grid;
      gap: 0.75rem;
      margin: 1rem 0;
    }
    .selection-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: var(--border-radius, 5px);
      cursor: pointer;
      background-color: #fff;
      text-align: left;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .selection-item:hover {
      border-color: var(--brand-color, #4f46e5);
    }
    .selection-item.selected {
      border-color: var(--brand-color, #4f46e5);
      box-shadow: 0 0 0 2px var(--brand-color, #4f46e5);
    }
    /* Estilos para logos dentro de los botones, si los usas */
    .selection-item img { 
      width: 24px; 
      height: 24px; 
      margin-right: 0.75rem; 
    }
    .footer-note {
      font-size: 0.8rem;
      color: #777;
      text-align: center;
    }
  `;

  // --- Render ---
  protected override render() {
    // Variable para almacenar el contenido del paso actual
    let stepContent;

    switch (this.currentStep) {
      case 'selectCoin':
        stepContent = html`
          <h2>Selecciona la stablecoin</h2>
          <p>Selecciona la stablecoin con la que deseas pagar</p>
          <div class="selection-list">
            ${this.stablecoins.map(coin => html`
              <button
                class="selection-item ${this.selectedCoinId === coin.id ? 'selected' : ''}"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.handleCoinSelected(coin.id)
                }}
              >
                ${coin.name} (${coin.symbol})
              </button>
            `)}
          </div>
          <p class="footer-note">Luego podrás seleccionar la red de tu preferencia</p>
        `;
        break; // Fin selectCoin

      case 'selectNetwork':
        stepContent = html`
          <h2>Selecciona la red</h2>
          <p>Selecciona la red de tu preferencia</p>
          <div class="selection-list">
             ${this.blockchains.map(chain => html`
              <button 
                class="selection-item ${this.selectedChainId === chain.id ? 'selected' : ''}" 
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.handleNetworkSelected(chain.id)
                }}
              >
                 ${chain.name}
              </button>
            `)}
          </div>
          <button @click=${(e: Event) => {
            e.stopPropagation();
            this.goToStep('selectCoin')
          }}>Volver</button> 
        `;
        break; // Fin selectNetwork

      case 'showQR':
        // Muestra spinner mientras se genera el QR
        if (!this.qrCodeUrl) {
            stepContent = html`<p>Generando código QR...</p><div class="spinner"></div>`; // Necesitarás CSS para el spinner
        } else {
            stepContent = html`
              <h2>Escanea para Pagar</h2>
              <p>Escanea el código QR con tu wallet para completar el pago de ${this.amount} ${this.currency} (${this.selectedCoinId}) en la red ${this.selectedChainId}.</p>
              <img src=${this.qrCodeUrl} alt="Código QR de pago" />
              <p>O envía a:</p>
              <code>${this.paymentAddress}</code>
              <button @click=${(e: Event) => {
                e.stopPropagation();
                this.goToStep('selectNetwork')
              }}>Volver</button> 
              `;
        }
        break; // Fin showQR

      case 'result':
        // Muestra éxito o error basado en el 'status' final
        if (this.status === 'success') {
            stepContent = html`
                <h2>¡Pago Exitoso!</h2>
                <p>Tu pago ha sido confirmado.</p>
                <button @click=${this.handleClose}>Cerrar</button>
            `;
        } else if (this.status === 'error') {
            stepContent = html`
                <h2>Error en el Pago</h2>
                <p>${this.error?.message || 'Ocurrió un error inesperado.'}</p>
                <button @click=${() => this.goToStep('showQR')}>Reintentar</button> 
                <button @click=${this.handleClose}>Cancelar</button>
            `;
        } else {
            stepContent = html`<p>Verificando pago...</p>`; // Estado intermedio
        }
        break; // Fin result
    }

    // Renderiza el <dialog> con el contenido del paso actual
    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        <div class="modal-header">
          <h3>Pago</h3> 
          <button @click=${this.handleClose} aria-label="Cerrar">X</button>
        </div>
        
        <div class="modal-body">
          ${stepContent}
        </div>
        
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'payment-modal': PaymentModal;
  }
}