import { css } from 'lit';

export const modalBaseStyles = css`
  dialog {
    border: none;
    padding: 0;
    margin: auto;
    
    /* Geometría basada en tus imágenes */
    width: 90vw;
    max-width: 420px; /* Un poco más ancho para que respire */
    border-radius: 20px; /* Bordes más redondeados */
    
    background-color: #ffffff; /* Fondo blanco puro */
    color: #1f2937;
    /* Sombra suave y difusa */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;

    /* Animaciones (Pop-up suave) */
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  dialog[open] {
    opacity: 1;
    transform: scale(1);
  }

  /* Backdrop oscuro pero no negro total */
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    transition: all 0.2s;
  }
`;