import { css } from 'lit';

export const spinnerStyles = css`
  /* Loading */
  .loading-indicator { text-align: center; padding: 2rem 0; color: var(--apolo-text-muted); }
  .spinner {
    border: 4px solid #f3f4f6;
    border-top: 4px solid var(--apolo-primary);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;