import { Dictionary } from './types';

export const en: Dictionary = {
  trigger: {
    pay: 'Pay {amount}',
    loading: 'Loading...',
  },
  modal: {
    titles: {
      selectAsset: 'Select <span class="highlight">stablecoin</span>',
      selectNetwork: 'Select <span class="highlight">network</span>',
      scanQr: 'Deposit <span class="highlight">{symbol}</span>',
      success: 'Thanks for <span class="highlight">your purchase!</span>',
      error: 'Payment Error',
      idle: 'Unexpected state'
    },
    subtitles: {
      selectAsset: 'Select the stablecoin you want to pay with',
      selectNetwork: 'Select your preferred network',
      scanQr: 'Product or service title',
      idle: 'An Unexpected error occurred'
    },
    actions: {
      back: 'Back',
      close: 'Close',
      paid: 'I have paid',
      support: 'Support',
      scanApp: 'Scan with your phone and continue from <br><span style="color: var(--apolo-accent)">Apolo Pay</span> app'
    },
    labels: {
      network: 'Network',
      address: 'Deposit Address',
      amount: 'Amount',
      product: 'Product or Service',
    },
    warnings: {
      networkMatch: 'Ensure your <strong>wallet network matches</strong> the destination network.',
      noNFT: 'Do not send NFTs to this wallet.',
      onlyToken: 'Only <strong>{symbol} deposits</strong> are accepted. Sending other tokens may result in loss.',
      timer: 'Complete payment within <strong>{time}</strong>. Otherwise, the QR code will expire.',
      selectNetworkLater: 'You will be able to select your preferred network later',
    },
    success: {
      message: 'Your payment was successful. You will receive an email',
      message2: 'shortly.',
      details: 'Purchase Details',
      support: 'Any doubt or inquiry you can contact support',
    }
  },
  errors: {
    generic: 'An unexpected error occurred.',
    publicKeyMissing: 'Public Key is missing',
    timeout: 'The payment time has expired. Please generate a new order.',
  }
};