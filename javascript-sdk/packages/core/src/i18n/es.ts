import { Dictionary } from './types';

export const es: Dictionary = {
  trigger: {
    loading: 'Cargando...',
  },
  modal: {
    titles: {
      selectAsset: 'Selecciona el <span class="highlight">stablecoin</span>',
      selectNetwork: 'Selecciona la <span class="highlight">red</span>',
      scanQr: 'Depósito <span class="highlight">{symbol}</span>',
      success: '¡Gracias por <span class="highlight">tu compra!</span>',
      error: 'Error en el Pago',
      idle: 'Estado inesperado',
      processing: '¡Procesando <span class="highlight">tu pago!</span>'
    },
    subtitles: {
      selectAsset: 'Selecciona la stablecoin con la que deseas pagar',
      selectNetwork: 'Selecciona la red de tu preferencia',
      idle: 'Ocurrio un error inesperado'
    },
    actions: {
      back: 'Volver',
      close: 'Cerrar',
      support: 'Soporte',
      scanApp: 'Escanea con tu celular y continua desde la app de <span style="color: var(--apolo-accent)">Apolo Pay</span>',
      copy: 'Copiar',
      copied: '¡Copiado!',
      payFromDevice: 'Pagar desde este dispositivo',
      understood: 'Entendido',
    },
    labels: {
      network: 'Red',
      address: 'Dirección de depósito',
      amount: 'Monto',
      product: 'Producto o Servicio',
      minutes: 'min',
      seconds: 'seg',
      amountSent: 'Monto Enviado',
      paid: 'Pagado',
      remainingToPay: 'Restante por pagar'
    },
    info: {
      noReloadPageTitle: '¡Por favor no <span style="color: var(--apolo-accent)">recargues la página!</span>',
      noReloadPageSubTitle: 'La pantalla se actualizara cuando confirmes tu pago',
      selectNetworkLater: 'Luego podrás seleccionar la red de tu preferencia',
      disclaimerTitle: 'Términos y Condiciones',
      disclaimerSubtitle:
        'Al utilizar Apolo Pay para procesar tu pago en criptomonedas, aceptas las siguientes condiciones de operación:',
      disclaimerBody: `
        <strong>1. Rol de Apolo Pay:</strong> Somos exclusivamente una pasarela tecnológica de pagos.
        No vendemos los productos ni servicios que estás adquiriendo. Cualquier reclamo, garantía o solicitud de reembolso relacionada con tu compra debe gestionarse <strong>directamente con el comercio.</strong><br><br>
        <strong>2. Moneda y Red Estricta:</strong> Este pago solo acepta <strong>USDT</strong>. Es tu responsabilidad exclusiva seleccionar la red correcta (ej. Ethereum, Binance Smart Chain, Arbitrum, Near Protocol) y enviar los fondos a la dirección generada. <strong>Si envías fondos a través de una red incorrecta o envías una criptomoneda distinta, tus fondos se perderán de forma permanente e irrecuperable.</strong><br><br>
        <strong>3. Montos Exactos (Cuidado con los Exchanges):</strong> Debes enviar el <strong>monto exacto</strong> que se muestra en pantalla. Si envías los fondos desde un Exchange centralizado (como Binance, KuCoin, etc.), asegúrate de agregar la comisión de retiro (withdrawal fee) al total. <strong>Los pagos parciales no completarán tu orden</strong> y deberás contactar al comercio para resolverlo.<br><br>
        <strong>4. Tiempo Límite:</strong> Tienes <strong>un plazo de tiempo</strong> para realizar la transferencia. Si envías el pago después de que el tiempo haya expirado, la transacción no se procesará automáticamente y deberás contactar al soporte del comercio.<br><br>
        <strong>5. Comisiones de Red (Gas Fees):</strong> Tú eres responsable de pagar las comisiones de red (gas) necesarias para enviar la transacción desde tu billetera personal hacia Apolo Pay.
        `,
      disclaimerConfirmation:
        'He leído y acepto los <a href="$termsURL" target="_blank"><strong>Términos de Pago con Criptomonedas</strong></a> de Apolo Pay.<br><br>Entiendo que enviar fondos por la red incorrecta y o enviar un monto incompleto resultará en la falla de la orden o la pérdida irreversible de mis fondos.',
    },
    warnings: {
      networkMatch: 'Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.',
      noNFT: 'No envíes NFTs a esta wallet.',
      onlyToken: 'Solo se aceptan <strong>depósitos en {symbol}</strong>. El envío de otro tipo de token podría resultar en su pérdida.',
      timer: 'Realiza el pago dentro del tiempo indicado. <strong>{time}</strong> De lo contrario, el código QR se vencerá.'
    },
    success: {
      message: 'Tu pago fue exitoso y en breve recibirás un correo',
      message2: 'con los detalles.',
      details: 'Detalles de la compra',
      support: 'Cualquier duda o inquietud puedes comunicarte con soporte'
    }
  },
  successes: {
    success: 'Éxito',
  },
  errors: {
    generic: 'Ocurrió un error inesperado.',
    publicKeyMissing: 'Falta la Public Key',
    config: 'Error de Configuración',
    timeout: 'El tiempo para realizar el pago ha expirado. Por favor genera una nueva orden.',
    paymentFailed: 'El pago ha fallado. Por favor genera una nueva orden.',
    connectError: 'Error de conexión.',
    socketConnectionError: 'Error de conexión en el socket.',
    dataLoadError: 'No se pudo cargar los datos de pago.',
    qrFetchError: 'Fallo al obtener los detalles del código QR.',
    paymentProcessNotAvailable: 'El proceso de pago no está disponible.',
    getAssetsError: 'Error al obtener los activos.',
    unknownError: 'Ocurrió un error inesperado.'
  }
};