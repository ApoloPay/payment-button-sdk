import { css } from 'lit';

export const spinnerStyles = css`
  .spinner-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--apolo-radius, 12px);
    cursor: wait;
    backdrop-filter: blur(2px);
  }

  .spinner {
    border: 4px solid #e5e7eb;
    border-top: 4px solid var(--apolo-primary, #6366f1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;