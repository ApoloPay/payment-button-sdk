import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* --- API DE DISEÑO PÚBLICA (Lo que el cliente puede tocar) --- */
    
    /* Colores */
    --apolo-primary: #6366f1;         /* Color principal de tu marca */
    --apolo-on-primary: #ffffff;      /* Texto sobre color principal */
    --apolo-bg: #ffffff;              /* Fondo del modal */
    --apolo-text: #1f2937;            /* Color de texto principal */
    --apolo-text-muted: #6b7280;      /* Color de texto secundario */
    --apolo-border: #e5e7eb;          /* Color de bordes */
    
    /* Forma */
    --apolo-radius: 12px;             /* Redondeo del modal y botones */
    --apolo-font: 'Inter', system-ui, sans-serif; /* Tipografía */
    --apolo-z-index: 9999;            /* Z-Index del modal */
  }

  /* --- ESTILOS INTERNOS (Lo que está estandarizado y protegido) --- */
  
  /* Aplicamos las variables */
  button.primary {
    background-color: var(--apolo-primary);
    color: var(--apolo-on-primary);
    border-radius: var(--apolo-radius);
    cursor: pointer;
  }

  .modal-container {
    background-color: var(--apolo-bg);
    border-radius: var(--apolo-radius);
    font-family: var(--apolo-font);
    color: var(--apolo-text);
  }
`;