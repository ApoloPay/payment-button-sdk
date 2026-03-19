import 'package:apolopay_sdk/i18n/types.dart';

const en = Dictionary(
  trigger: DictionaryTrigger(
    loading: 'Loading...',
  ),
  modal: DictionaryModal(
    titles: DictionaryModalTitles(
      selectAsset: 'Select <span class="highlight">stablecoin</span>',
      selectNetwork: 'Select <span class="highlight">network</span>',
      scanQr: 'Deposit <span class="highlight">{symbol}</span>',
      success: 'Thanks for <span class="highlight">your purchase!</span>',
      error: 'Payment Error',
      idle: 'Unexpected state',
      processing: 'Processing <span class="highlight">your payment!</span>',
    ),
    subTitles: DictionaryModalSubTitles(
      selectAsset: 'Select the stablecoin you want to pay with',
      selectNetwork: 'Select your preferred network',
      idle: 'An Unexpected error occurred',
    ),
    actions: DictionaryModalActions(
      back: 'Back',
      close: 'Close',
      support: 'Support',
      scanApp:
          'Scan with your phone and continue from <br><span class="highlight">Apolo Pay</span> app',
      copy: 'Copy',
      copied: 'Copied!',
      payFromDevice: 'Pay from this device',
    ),
    labels: DictionaryModalLabels(
      network: 'Network',
      address: 'Deposit Address',
      amount: 'Amount',
      product: 'Product or Service',
      minutes: 'min',
      seconds: 'sec',
      amountSent: 'Amount sent',
      paid: 'Paid',
      remainingToPay: 'Remaining balance to pay',
    ),
    info: DictionaryModalInfo(
      noReloadPageTitle:
          'Please do not <span class="highlight">reload the page!</span>',
      noReloadPageSubTitle:
          'The screen will update when you confirm your payment',
      selectNetworkLater:
          'You will be able to select your preferred network later',
    ),
    warnings: DictionaryModalWarnings(
      networkMatch:
          'Ensure your wallet <strong>network matches</strong> the destination network.',
      noNFT: 'Do not send NFTs to this wallet.',
      onlyToken:
          'Only <strong>{symbol} deposits</strong> are accepted. Sending other tokens may result in loss.',
      timer:
          'Complete payment within <strong>{time}</strong>. Otherwise, the QR code will expire.',
    ),
    success: DictionaryModalSuccess(
      message: 'Your payment was successful. You will receive an email',
      message2: 'shortly.',
      details: 'Purchase Details',
      support: 'Any doubt or inquiry you can contact support',
    ),
  ),
  successes: DictionarySuccesses(
    success: 'Success',
  ),
  errors: DictionaryErrors(
    generic: 'An unexpected error occurred.',
    publicKeyMissing: 'Public Key is missing',
    config: 'Config Error',
    timeout: 'The payment time has expired. Please generate a new order.',
    paymentFailed: 'The payment has failed. Please generate a new order.',
    connectError: 'Connection error in real time.',
    socketConnectionError: 'Connection error in socket.',
    dataLoadError: 'Could not load payment options.',
    qrFetchError: 'Failed to get payment details.',
    paymentProcessNotAvailable: 'The payment process is not available.',
    getAssetsError: 'Failed to get assets.',
    unknownError: 'An unexpected error occurred.',
  ),
);
