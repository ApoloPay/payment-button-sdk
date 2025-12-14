import { css } from 'lit';

export const textFieldBaseStyles = css`
  /* Inputs de solo lectura (Diseño Apolo) */
  .text-field {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    text-align: left;
    position: relative;
  }
  .text-field-label {
    --padding-left: 0.25rem;
    --padding-top: 0.15rem;
    font-size: 0.75rem;
    color: #9ca3af;
    border-radius: calc(var(--apolo-radius) - 1px);
    background: #ffffff;
    padding: var(--padding-top) var(--padding-left);
    position: absolute;
    top: calc(-0.5rem - var(--padding-top));
    left: calc(1rem - var(--padding-left));
    display: block;
    z-index: 2;
  }
  .text-field-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #526282;
    border-radius: var(--apolo-radius);
    background: #ffffff;
    color: #4b5563;
    font-size: 0.9rem;
    z-index: 1;
  }
  .btn-secondary {
    background-color: #526282;
    color: #ffffff;
    border: none;
    border-radius: var(--apolo-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
`;