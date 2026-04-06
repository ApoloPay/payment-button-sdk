class Dictionary {
  const Dictionary({
    required this.trigger,
    required this.modal,
    required this.successes,
    required this.errors,
  });
  final DictionaryTrigger trigger;
  final DictionaryModal modal;
  final DictionarySuccesses successes;
  final DictionaryErrors errors;
}

class DictionaryTrigger {
  const DictionaryTrigger({
    required this.loading,
  });
  final String loading;
}

class DictionaryModal {
  const DictionaryModal({
    required this.titles,
    required this.subTitles,
    required this.actions,
    required this.labels,
    required this.info,
    required this.warnings,
    required this.success,
  });
  final DictionaryModalTitles titles;
  final DictionaryModalSubTitles subTitles;
  final DictionaryModalActions actions;
  final DictionaryModalLabels labels;
  final DictionaryModalInfo info;
  final DictionaryModalWarnings warnings;
  final DictionaryModalSuccess success;
}

class DictionaryModalTitles {
  const DictionaryModalTitles({
    required this.selectAsset,
    required this.selectNetwork,
    required this.scanQr,
    required this.success,
    required this.error,
    required this.idle,
    required this.processing,
  });
  final String selectAsset;
  final String selectNetwork;
  final String scanQr;
  final String success;
  final String error;
  final String idle;
  final String processing;
}

class DictionaryModalSubTitles {
  const DictionaryModalSubTitles({
    required this.selectAsset,
    required this.selectNetwork,
    required this.idle,
  });
  final String selectAsset;
  final String selectNetwork;
  final String idle;
}

class DictionaryModalActions {
  const DictionaryModalActions({
    required this.back,
    required this.close,
    required this.support,
    required this.scanApp,
    required this.copy,
    required this.copied,
    required this.payFromDevice,
    required this.understood,
  });
  final String back;
  final String close;
  final String support;
  final String scanApp;
  final String copy;
  final String copied;
  final String payFromDevice;
  final String understood;
}

class DictionaryModalLabels {
  const DictionaryModalLabels({
    required this.network,
    required this.address,
    required this.amount,
    required this.product,
    required this.minutes,
    required this.seconds,
    required this.amountSent,
    required this.paid,
    required this.remainingToPay,
  });
  final String network;
  final String address;
  final String amount;
  final String product;
  final String minutes;
  final String seconds;
  final String amountSent;
  final String paid;
  final String remainingToPay;
}

class DictionaryModalInfo {
  const DictionaryModalInfo({
    required this.noReloadPageTitle,
    required this.noReloadPageSubTitle,
    required this.selectNetworkLater,
    required this.disclaimerTitle,
    required this.disclaimerSubtitle,
    required this.disclaimerBody,
    required this.disclaimerConfirmation,
  });
  final String noReloadPageTitle;
  final String noReloadPageSubTitle;
  final String selectNetworkLater;
  final String disclaimerTitle;
  final String disclaimerSubtitle;
  final String disclaimerBody;
  final String disclaimerConfirmation;
}

class DictionaryModalWarnings {
  const DictionaryModalWarnings({
    required this.networkMatch,
    required this.noNFT,
    required this.onlyToken,
    required this.timer,
  });
  final String networkMatch;
  final String noNFT;
  final String onlyToken;
  final String timer;
}

class DictionaryModalSuccess {
  const DictionaryModalSuccess({
    required this.message,
    required this.message2,
    required this.details,
    required this.support,
  });
  final String message;
  final String message2;
  final String details;
  final String support;
}

class DictionarySuccesses {
  const DictionarySuccesses({
    required this.success,
  });
  final String success;
}

class DictionaryErrors {
  const DictionaryErrors({
    required this.generic,
    required this.publicKeyMissing,
    required this.config,
    required this.timeout,
    required this.paymentFailed,
    required this.connectError,
    required this.socketConnectionError,
    required this.dataLoadError,
    required this.qrFetchError,
    required this.paymentProcessNotAvailable,
    required this.getAssetsError,
    required this.unknownError,
  });
  final String generic;
  final String publicKeyMissing;
  final String config;
  final String timeout;
  final String paymentFailed;
  final String connectError;
  final String socketConnectionError;
  final String dataLoadError;
  final String qrFetchError;
  final String paymentProcessNotAvailable;
  final String getAssetsError;
  final String unknownError;
}
