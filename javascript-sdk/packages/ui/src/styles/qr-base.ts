import { css } from 'lit';

export const qrBaseStyles = css`
  .qr-frame {
    background: white;
    padding: 16px;
    border-radius: var(--apolo-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    max-width: 90%;
    box-sizing: border-box;
  }
  
  .qr-badge {
    color: var(--apolo-accent);
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 12px;
    text-align: center;
    word-break: break-all;
    max-width: 100%;
  }

  .qr-wrapper {
    position: relative;
    display: block;
    width: 150px;
    height: 150px;
  }

  .qr-code-img {
    width: 100%;
    height: 100%;
  }

  .qr-overlay-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    width: 36px;
    height: 36px;
    
    object-fit: contain;
    background-color: white;
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;