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
    config: string;
    timeout: string;
  };
}