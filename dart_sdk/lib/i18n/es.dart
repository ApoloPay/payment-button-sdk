import 'package:apolopay_sdk/i18n/types.dart';

const es = Dictionary(
  trigger: DictionaryTrigger(
    loading: 'Cargando...',
  ),
  modal: DictionaryModal(
    titles: DictionaryModalTitles(
      selectAsset: 'Selecciona el <span class="highlight">stablecoin</span>',
      selectNetwork: 'Selecciona la <span class="highlight">red</span>',
      scanQr: 'Depósito <span class="highlight">{symbol}</span>',
      success: '¡Gracias por <span class="highlight">tu compra!</span>',
      error: 'Error en el Pago',
      idle: 'Estado inesperado',
      processing: '¡Procesando <span class="highlight">tu pago!</span>',
    ),
    subTitles: DictionaryModalSubTitles(
      selectAsset: 'Selecciona la stablecoin con la que deseas pagar',
      selectNetwork: 'Selecciona la red de tu preferencia',
      idle: 'Ocurrio un error inesperado',
    ),
    actions: DictionaryModalActions(
      back: 'Volver',
      close: 'Cerrar',
      support: 'Soporte',
      scanApp:
          'Escanea con tu celular y continua desde la app de <span class="highlight">Apolo Pay</span>',
      copy: 'Copiar',
      copied: '¡Copiado!',
      payFromDevice: 'Pagar desde este dispositivo',
    ),
    labels: DictionaryModalLabels(
      network: 'Red',
      address: 'Dirección de depósito',
      amount: 'Monto',
      product: 'Producto o Servicio',
      minutes: 'min',
      seconds: 'seg',
      amountSent: 'Monto Enviado',
      paid: 'Pagado',
      remainingToPay: 'Restante por pagar',
    ),
    info: DictionaryModalInfo(
      noReloadPageTitle:
          '¡Por favor no <span class="highlight">recargues la página!</span>',
      noReloadPageSubTitle:
          'La pantalla se actualizara cuando confirmes tu pago',
      selectNetworkLater: 'Luego podrás seleccionar la red de tu preferencia',
    ),
    warnings: DictionaryModalWarnings(
      networkMatch:
          'Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.',
      noNFT: 'No envíes NFTs a esta wallet.',
      onlyToken:
          'Solo se aceptan <strong>depósitos en {symbol}</strong>. El envío de otro tipo de token podría resultar en su pérdida.',
      timer:
          'Realiza el pago dentro del tiempo indicado. <strong>{time}</strong> De lo contrario, el código QR se vencerá.',
    ),
    success: DictionaryModalSuccess(
      message: 'Tu pago fue exitoso y en breve recibirás un correo',
      message2: 'con los detalles.',
      details: 'Detalles de la compra',
      support: 'Cualquier duda o inquietud puedes comunicarte con soporte',
    ),
  ),
  successes: DictionarySuccesses(
    success: 'Éxito',
  ),
  errors: DictionaryErrors(
    generic: 'Ocurrió un error inesperado.',
    publicKeyMissing: 'Falta la Public Key',
    config: 'Error de Configuración',
    timeout:
        'El tiempo para realizar el pago ha expirado. Por favor genera una nueva orden.',
    paymentFailed: 'El pago ha fallado. Por favor genera una nueva orden.',
    connectError: 'Error de conexión.',
    socketConnectionError: 'Error de conexión en el socket.',
    dataLoadError: 'No se pudo cargar los datos de pago.',
    qrFetchError: 'Fallo al obtener los detalles del código QR.',
    paymentProcessNotAvailable: 'El proceso de pago no está disponible.',
    getAssetsError: 'Error al obtener los activos.',
    unknownError: 'Ocurrió un error inesperado.',
  ),
);
