import { css } from 'lit';

export const textFieldBaseStyles = css`
  /* Inputs de solo lectura */
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
    color: var(--smartpay-text-muted);
    border-radius: calc(var(--smartpay-radius) - 1px);
    background: var(--smartpay-bg);
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
    border: 1px solid var(--smartpay-border);
    border-radius: var(--smartpay-radius);
    background: var(--smartpay-bg);
    color: var(--smartpay-text);
    font-size: 0.9rem;
    z-index: 1;
  }
  .btn-secondary {
    background-color: var(--smartpay-primary-darkest);
    color: var(--smartpay-on-primary);
    border: none;
    border-radius: var(--smartpay-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
`;