import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* --- API PÚBLICA DE COLORES (THEMING) --- */
    --apolo-primary: var(--payment-button-primary, #0388c0);
    --apolo-primary-darkest: var(--payment-button-primary-darkest, #041c4c);
    --apolo-on-primary: var(--payment-button-on-primary, #ffffff);
    
    --apolo-bg: var(--payment-button-bg, #f6f2ec);
    --apolo-text: var(--payment-button-text, #1c315c);
    --apolo-text-muted: var(--payment-button-text-muted, #6b7280);
    --apolo-accent: var(--payment-button-accent, #ea580c);
    --apolo-border: var(--payment-button-border, #e5e7eb);
    
    /* --- API PÚBLICA DE FORMA Y TIPOGRAFÍA --- */
    --apolo-radius: var(--payment-button-radius, 12px);
    --apolo-radius-lg: var(--payment-button-radius-lg, 30px);
    --apolo-font: var(--payment-button-font, 'Inter', system-ui, -apple-system, sans-serif);
    --apolo-shadow: var(--payment-button-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    --apolo-z-index: var(--payment-button-z-index, 9999);
  }

  /* Reset global para componentes internos */
  * {
    box-sizing: border-box;
    font-family: var(--apolo-font);
  }

  a {
    color: var(--apolo-accent);
  }

  /* Botón Naranja Grande */
  .btn-primary {
    background-color: var(--apolo-accent); /* Naranja Apolo */
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: var(--apolo-radius-lg); /* Pill shape */
    border: none;
    font-weight: 400;
    font-size: .9rem;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(234, 88, 12, 0.4); }
  
  /* Botón Azul Oscuro (Apolo Pay QR) */
  .btn-dark {
    background-color: var(--apolo-primary-darkest);
    color: white;
    width: 100%;
    padding: 1rem;
    border-radius: var(--apolo-radius);
    border: none;
    font-weight: 600;
    cursor: pointer;
    margin-block: 0.25rem 1.25rem;
  }

  .warning-text {
    font-size: 0.75rem;
    text-align: left;
    margin-top: 1.5rem;
    line-height: 1.5;
  }
  .warning-text strong { color: var(--apolo-accent); }

  .warning-text ul {
    padding-left: 1.5rem;
  }
`;