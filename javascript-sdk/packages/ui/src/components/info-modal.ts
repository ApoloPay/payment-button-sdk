import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { I18n, type Locale } from '@apolopay-sdk/core';
import { modalBaseStyles } from '../styles/modal-base';
import { sharedStyles } from '../styles/shared-styles';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// 1. Definimos la interfaz para los parámetros del modal
export interface InfoModalOptions {
  title?: string;
  subtitle?: string;
  content: TemplateResult | string;
  barrierDismissible?: boolean;
  lang?: Locale;
}

// 2. Definimos los posibles resultados al cerrar
export type ModalResult = boolean;

@customElement('info-modal')
export class InfoModal extends LitElement {

  // ==========================================
  // 🚀 MÉTODO ESTÁTICO DE INVOCACIÓN (El reemplazo de React)
  // ==========================================
  static show(options: InfoModalOptions): Promise<ModalResult> {
    return new Promise((resolve) => {
      // 1. Crear la instancia del Web Component nativamente
      const modalElement = document.createElement('info-modal') as InfoModal;

      // 2. Asignar las propiedades recibidas
      modalElement.modalTitle = options.title || '';
      modalElement.modalSubtitle = options.subtitle || '';
      modalElement.contentTemplate = options.content;
      modalElement.barrierDismissible = options.barrierDismissible ?? true;
      if (options.lang) modalElement.lang = options.lang;

      // 3. Función para manejar el cierre y limpiar el DOM
      const handleClose = (e: Event) => {
        const customEvent = e as CustomEvent<ModalResult>;
        const result = customEvent.detail;

        // Limpiar event listeners
        modalElement.removeEventListener('modal-closed', handleClose);

        // Desmontar el componente del DOM de forma segura
        if (document.body.contains(modalElement)) {
          document.body.removeChild(modalElement);
        }

        // Resolver la promesa para desbloquear el 'await' del consumidor
        resolve(result);
      };

      // 4. Escuchar el evento personalizado de cierre
      modalElement.addEventListener('modal-closed', handleClose);

      // 5. Inyectar en el DOM
      document.body.appendChild(modalElement);

      // 6. Disparar la apertura en el próximo frame para asegurar que Lit renderizó
      requestAnimationFrame(() => {
        modalElement.isOpen = true;
      });
    });
  }

  // --- Props Dinámicas ---
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Boolean }) barrierDismissible: boolean = false;
  @property({ type: String }) override lang: Locale = 'es';

  // Props para el contenido genérico
  @property({ type: String }) modalTitle = '';
  @property({ type: String }) modalSubtitle = '';
  @property({ type: Object }) contentTemplate: TemplateResult | string | null = null;

  // Razón de cierre interna para enviar al resolver la promesa
  private closeReason: ModalResult = false;

  // --- DOM Element Reference ---
  @query('dialog') private dialogElement!: HTMLDialogElement;

  override disconnectedCallback() {
    super.disconnectedCallback();
    const dialog = this.dialogElement;
    if (dialog && dialog.open) {
      dialog.close();
    }
  }

  // --- Lifecycle: Manage Dialog State ---
  override async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    await this.updateComplete;

    if (changedProperties.has('isOpen')) {
      const dialog = this.dialogElement;
      if (!dialog) return;

      if (this.isOpen) {
        dialog.classList.remove('closing');
        if (!dialog.open) {
          dialog.showModal();
        }
        dialog.addEventListener('click', this.handleBackdropClick);
      } else {
        dialog.removeEventListener('click', this.handleBackdropClick);
        if (!dialog.open) return;

        dialog.classList.add('closing');

        const onAnimationEnd = (e: AnimationEvent) => {
          if (e.target === dialog) {
            this.closeDialogFinal(dialog, onAnimationEnd);
          }
        };

        dialog.addEventListener('animationend', onAnimationEnd);

        setTimeout(() => {
          if (dialog.open) this.closeDialogFinal(dialog, onAnimationEnd);
        }, 200);
      }
    }
  }

  private closeDialogFinal(dialog: HTMLDialogElement, listener: any) {
    dialog.removeEventListener('animationend', listener);
    dialog.classList.remove('closing');

    if (dialog.open) dialog.close();

    // 📢 Emitimos el evento de que ya se cerró completamente para que el método estático limpie el DOM
    this.dispatchEvent(new CustomEvent('modal-closed', {
      detail: this.closeReason,
      bubbles: true,
      composed: true
    }));
  }

  // --- Manejadores de Cierre ---
  private requestClose(reason: ModalResult = false) {
    this.closeReason = reason;
    this.isOpen = false;
  }

  private handleBackdropClick = (event: MouseEvent) => {
    if (event.target !== this.dialogElement) return;
    if (this.dialogElement.classList.contains('closing')) return;
    if (!this.barrierDismissible) return;

    const rect = this.dialogElement.getBoundingClientRect();
    const clickedOutside = (
      event.clientY < rect.top || event.clientY > rect.bottom ||
      event.clientX < rect.left || event.clientX > rect.right
    );
    if (clickedOutside) {
      this.requestClose(false);
    }
  }

  private handleDialogNativeClose(event: Event) {
    event.preventDefault();
    this.requestClose(false);
  }

  // --- Styles ---
  static override styles = [
    sharedStyles,
    modalBaseStyles,
    css`
      .modal-header {
        position: relative;
        padding: 1.5rem 1.5rem 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .close-button {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        transition: color 0.2s;
        padding: 5px;
        font-size: 1.5rem;
      }
      .close-button:hover { color: #374151; }
      .modal-body {
        padding: 1rem 2rem 2.5rem;
        text-align: center;
      }
      .modal-content-slot {
        max-height: 400px;
        margin-bottom: 1rem;
        overflow-y: auto;
        font-size: 0.8rem;
        text-align: left;
      }
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
      }
      p.subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0 0 1rem;
        line-height: 1.4;
      }
    `
  ];

  protected override render() {
    return html`
      <dialog @close=${this.handleDialogNativeClose}>
        <div class="modal-header">
          <button class="close-button" @click=${() => this.requestClose(false)}>&times;</button>
        </div>
        <div class="modal-body">
          ${this.modalTitle ? html`<h2>${this.modalTitle}</h2>` : ''}
          ${this.modalSubtitle ? html`<p class="subtitle">${this.modalSubtitle}</p>` : ''}

          <div class="modal-content-slot">
            ${typeof this.contentTemplate === "string" ? unsafeHTML(this.contentTemplate) : this.contentTemplate}
          </div>

          <button style="width: 100%;" class="btn-primary" @click=${() => this.requestClose(true)}>${I18n.t.modal.actions.understood}</button>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'info-modal': InfoModal;
  }
}