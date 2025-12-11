import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* --- API PÚBLICA DE COLORES (THEMING) --- */
    --apolo-primary: var(--payment-button-primary, #6366f1);
    --apolo-primary-hover: var(--payment-button-primary-hover, #4f46e5);
    --apolo-on-primary: var(--payment-button-on-primary, #ffffff);
    
    --apolo-bg: var(--payment-button-bg, #ffffff);
    --apolo-text: var(--payment-button-text, #1f2937);
    --apolo-text-muted: var(--payment-button-text-muted, #6b7280);
    --apolo-border: var(--payment-button-border, #e5e7eb);
    
    /* --- API PÚBLICA DE FORMA Y TIPOGRAFÍA --- */
    --apolo-radius: var(--payment-button-radius, 12px);
    --apolo-font: var(--payment-button-font, 'Inter', system-ui, -apple-system, sans-serif);
    --apolo-shadow: var(--payment-button-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    --apolo-z-index: var(--payment-button-z-index, 9999);
  }

  /* Reset global para componentes internos */
  * {
    box-sizing: border-box;
    font-family: var(--apolo-font);
  }
`;