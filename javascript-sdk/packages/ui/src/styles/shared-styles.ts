import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* Variables CSS */
    --brand-color: #4f46e5;
    --text-color: #333;
    --border-radius: 5px;
  }

  button {
    font-family: inherit; /* Hereda la fuente */
    cursor: pointer;
  }
`;