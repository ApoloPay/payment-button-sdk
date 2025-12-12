export interface Dictionary {
  trigger: {
    pay: string;
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
    };
    subtitles: {
      selectAsset: string;
      selectNetwork: string;
      scanQr: string;
      idle: string;
    };
    actions: {
      back: string;
      close: string;
      paid: string;
      support: string;
      scanApp: string;
    };
    labels: {
      network: string;
      address: string;
      amount: string;
      product: string;
    };
    warnings: {
      networkMatch: string;
      noNFT: string;
      onlyToken: string;
      timer: string;
      selectNetworkLater: string;
    };
    success: {
      message: string;
      message2: string;
      details: string;
      support: string;
    };
  };
  errors: {
    generic: string;
    publicKeyMissing: string;
    timeout: string;
  };
}