import { css } from 'lit';

export const modalBaseStyles = css`
/* 1. Definimos las Animaciones */
  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes modal-exit {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.95) translateY(10px); }
  }

  @keyframes backdrop-enter {
    from { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
    to { background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
  }

  @keyframes backdrop-exit {
    from { background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
    to { background-color: rgba(0, 0, 0, 0); backdrop-filter: blur(0px); }
  }

  /* 2. Estilos Base */
  dialog {
    border: none;
    padding: 0;
    margin: auto;
    
    /* Geometría */
    min-width: 320px;
    max-width: 420px;
    width: 90vw;
    border-radius: var(--apolo-radius);
    
    background-color: var(--apolo-bg);
    color: var(--apolo-text);
    box-shadow: var(--apolo-shadow);
    font-family: var(--apolo-font);

    opacity: 0;
    pointer-events: none;
  }

  /* 3. Estado: ABIERTO (Animación de Entrada) */
  dialog[open] {
    opacity: 1;
    animation: modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: auto;
  }

  /* 4. Estado: CERRANDO (Animación de Salida) */
  dialog.closing {
    /* Sobrescribimos la animación de entrada */
    animation: modal-exit 0.15s ease-in forwards;
  }

  /* 5. Backdrop (Fondo Oscuro) */
  dialog::backdrop {
    background-color: rgba(0,0,0,0); /* Invisible por defecto */
  }

  dialog[open]::backdrop {
    animation: backdrop-enter 0.2s ease-out forwards;
  }

  dialog.closing::backdrop {
    animation: backdrop-exit 0.15s ease-in forwards;
  }

  dialog:not([open])::backdrop {
    display: none;
    pointer-events: none;
  }
`;