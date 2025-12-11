import { css } from 'lit';

export const modalBaseStyles = css`
  /* --- Estilos Base del Elemento Dialog --- */
  dialog {
    /* Reset nativo */
    border: none;
    padding: 0;
    margin: auto; /* Centrado nativo */
    
    /* Dimensiones y Forma */
    min-width: 320px;
    max-width: 400px;
    width: 90vw;
    border-radius: var(--apolo-radius, 12px);
    
    /* Theming (Colores base) */
    background-color: var(--apolo-bg, #ffffff);
    color: var(--apolo-text, #1f2937);
    box-shadow: var(--apolo-shadow, 0 10px 25px rgba(0,0,0,0.1));
    font-family: var(--apolo-font, sans-serif);

    /* --- ANIMACIONES (Core Logic) --- */
    /* Estado inicial (Oculto/Cerrado) */
    opacity: 0;
    transform: scale(0.95) translateY(10px);
    
    /* Transiciones */
    /* 'allow-discrete' es vital para animar display:none a display:block */
    transition: 
      opacity 0.2s ease-out, 
      transform 0.2s ease-out, 
      overlay 0.2s ease-out allow-discrete, 
      display 0.2s ease-out allow-discrete;
  }

  /* Estado Abierto (Visible) */
  dialog[open] {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  /* Estado de Entrada (@starting-style permite animar al aparecer) */
  @starting-style {
    dialog[open] {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
  }

  /* Estado de Salida (Clase .closing que agregas con JS) */
  dialog.closing {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  /* --- BACKDROP (El fondo oscuro) --- */
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: 
      background-color 0.2s ease-out, 
      backdrop-filter 0.2s ease-out, 
      overlay 0.2s ease-out allow-discrete, 
      display 0.2s ease-out allow-discrete;
  }

  dialog[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
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
`;