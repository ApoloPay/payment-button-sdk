export interface Dictionary {
  trigger: {
    loading: string;
  };
  modal: {
    titles: {
      selectAsset: string;
      selectNetwork: string;
      scanQr: string;
      success: string;
      error: string;
      idle: string;
      processing: string;
    };
    subtitles: {
      selectAsset: string;
      selectNetwork: string;
      idle: string;
    };
    actions: {
      back: string;
      close: string;
      support: string;
      scanApp: string;
      copy: string;
      copied: string;
      payFromDevice: string;
    };
    labels: {
      network: string;
      address: string;
      amount: string;
      product: string;
      minutes: string;
      seconds: string;
      amountSent: string;
      paid: string;
      remainingToPay: string;
    };
    info: {
      noReloadPageTitle: string;
      noReloadPageSubTitle: string;
      selectNetworkLater: string;
    };
    warnings: {
      networkMatch: string;
      noNFT: string;
      onlyToken: string;
      timer: string;
    };
    success: {
      message: string;
      message2: string;
      details: string;
      support: string;
    };
  };
  successes: {
    success: string;
  };
  errors: {
    generic: string;
    publicKeyMissing: string;
    config: string;
    timeout: string;
    paymentFailed: string;
    connectError: string;
    socketConnectionError: string;
    dataLoadError: string;
    qrFetchError: string;
    getAssetsError: string;
    unknownError: string;
  };
}