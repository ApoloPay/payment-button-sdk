import 'package:apolopay_sdk/i18n/types.dart';
import 'package:apolopay_sdk/utils/variables.dart';

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
      understood: 'Accept',
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
      disclaimerTitle: 'Terms and Conditions',
      disclaimerSubtitle:
          'By using Apolo Pay to process your cryptocurrency payment, you accept the following operating conditions:',
      disclaimerBody:
          "<strong>1. Role of Apolo Pay:</strong> We are exclusively a technological payment gateway. "
          "We do not sell the products or services you are acquiring. Any claim, warranty, or "
          "refund request related to your purchase must be managed <strong>directly with the merchant.</strong><br><br>"
          "<strong>2. Strict Currency and Network:</strong> This payment only accepts <strong>USDT</strong>. It is your "
          "exclusive responsibility to select the correct network (e.g., Ethereum, Binance Smart Chain, Arbitrum, Near Protocol) "
          "and send the funds to the generated address. <strong>If you send funds through an incorrect network or "
          "send a different cryptocurrency, your funds will be permanently and irretrievably lost.</strong><br><br>"
          "<strong>3. Exact Amounts (Beware of Exchanges):</strong> You must send the <strong>exact amount</strong> "
          "shown on the screen. If you are sending funds from a centralized Exchange (like Binance, KuCoin, etc.), "
          "make sure to add the withdrawal fee to the total. <strong>Partial payments will not complete "
          "your order</strong> and you will need to contact the merchant to resolve it.<br><br>"
          "<strong>4. Time Limit:</strong> You have <strong>30 minutes</strong> to make the transfer. "
          "If you send the payment after the time has expired, the transaction will not be processed automatically and "
          "you will need to contact the merchant's support.<br><br>"
          "<strong>5. Network Fees (Gas Fees):</strong> You are responsible for paying the network fees "
          "(gas) required to send the transaction from your personal wallet to Apolo Pay.",
      disclaimerConfirmation:
          'I have read and accept the <a href="$termsURL" target="_blank"><strong>Terms of Payment with Cryptocurrencies</strong></a> of Apolo Pay.\n\nI understand that sending funds through the wrong network and or sending an incomplete amount will result in the failure of the order or the irreversible loss of my funds.',
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
