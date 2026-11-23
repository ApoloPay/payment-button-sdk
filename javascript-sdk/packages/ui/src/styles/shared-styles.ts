import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* --- API PÚBLICA DE COLORES (THEMING) --- */
    /* Valores por defecto: identidad monocromática de Nexora. */
    --smartpay-primary: var(--payment-button-primary, var(--apolo-primary, #08090b)); /* Negro Nexora */
    --smartpay-primary-darkest: var(--payment-button-primary-darkest, var(--apolo-primary-darkest, #202328)); /* Carbón */
    --smartpay-on-primary: var(--payment-button-on-primary, var(--apolo-on-primary, #ffffff));

    --smartpay-bg: var(--payment-button-bg, var(--apolo-bg, #ffffff));
    --smartpay-text: var(--payment-button-text, var(--apolo-text, #08090b));
    --smartpay-text-muted: var(--payment-button-text-muted, var(--apolo-text-muted, #6b7078)); /* Gris medio */
    --smartpay-accent: var(--payment-button-accent, var(--apolo-accent, #08090b));
    --smartpay-border: var(--payment-button-border, var(--apolo-border, #d9dde1)); /* Plata */

    /* --- API PÚBLICA DE FORMA Y TIPOGRAFÍA --- */
    --smartpay-radius: var(--payment-button-radius, var(--apolo-radius, 12px));
    /* Botones: esquinas suaves, no píldoras. */
    --smartpay-radius-lg: var(--payment-button-radius-lg, var(--apolo-radius-lg, 10px));
    /* Montserrat solo si la página del comercio ya la tiene: el SDK no carga fuentes de terceros. */
    --smartpay-font: var(--payment-button-font, var(--apolo-font, 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif));
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

  /* Botón principal: negro con texto blanco */
  .btn-primary {
    background-color: var(--smartpay-primary);
    color: var(--smartpay-on-primary);
    padding: 0.75rem 1.5rem;
    border-radius: var(--smartpay-radius-lg);
    border: none;
    font-weight: 600;
    font-size: .9rem;
    cursor: pointer;
    transition: background-color 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background-color: var(--smartpay-primary-darkest); transform: translateY(-1px); }

  /* Banner oscuro (aviso de no recargar / app) */
  .btn-dark {
    background-color: var(--smartpay-primary-darkest);
    color: var(--smartpay-on-primary);
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