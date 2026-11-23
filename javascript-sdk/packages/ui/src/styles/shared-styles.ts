import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* --- API PÚBLICA DE COLORES (THEMING) --- */
    --smartpay-primary: var(--payment-button-primary, var(--apolo-primary, #0388c0));
    --smartpay-primary-darkest: var(--payment-button-primary-darkest, var(--apolo-primary-darkest, #041c4c));
    --smartpay-on-primary: var(--payment-button-on-primary, var(--apolo-on-primary, #ffffff));
    
    --smartpay-bg: var(--payment-button-bg, var(--apolo-bg, #f6f2ec));
    --smartpay-text: var(--payment-button-text, var(--apolo-text, #1c315c));
    --smartpay-text-muted: var(--payment-button-text-muted, var(--apolo-text-muted, #6b7280));
    --smartpay-accent: var(--payment-button-accent, var(--apolo-accent, #ea580c));
    --smartpay-border: var(--payment-button-border, var(--apolo-border, #e5e7eb));
    
    /* --- API PÚBLICA DE FORMA Y TIPOGRAFÍA --- */
    --smartpay-radius: var(--payment-button-radius, var(--apolo-radius, 12px));
    --smartpay-radius-lg: var(--payment-button-radius-lg, var(--apolo-radius-lg, 30px));
    --smartpay-font: var(--payment-button-font, var(--apolo-font, 'Inter', system-ui, -apple-system, sans-serif));
    --smartpay-shadow: var(--payment-button-shadow, var(--apolo-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)));
    --smartpay-z-index: var(--payment-button-z-index, var(--apolo-z-index, 9999));
  }

  /* Reset global para componentes internos */
  * {
    box-sizing: border-box;
    font-family: var(--smartpay-font);
  }

  a {
    color: var(--smartpay-accent);
  }

  /* Botón Naranja Grande */
  .btn-primary {
    background-color: var(--smartpay-accent); /* Naranja Apolo */
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: var(--smartpay-radius-lg); /* Pill shape */
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
    background-color: var(--smartpay-primary-darkest);
    color: white;
    width: 100%;
    padding: 1rem;
    border-radius: var(--smartpay-radius);
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
  .warning-text strong { color: var(--smartpay-accent); }

  .warning-text ul {
    padding-left: 1.5rem;
  }
`;