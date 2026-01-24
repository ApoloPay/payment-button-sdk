final Map<String, dynamic> es = {
  'trigger': {
    'loading': 'Cargando...',
  },
  'modal': {
    'titles': {
      'selectAsset': 'Selecciona el <span class="highlight">stablecoin</span>',
      'selectNetwork': 'Selecciona la <span class="highlight">red</span>',
      'scanQr': 'Depósito <span class="highlight">{symbol}</span>',
      'success': '¡Gracias por <span class="highlight">tu compra!</span>',
      'error': 'Error en el Pago',
      'idle': 'Estado inesperado'
    },
    'subtitles': {
      'selectAsset': 'Selecciona la stablecoin con la que deseas pagar',
      'selectNetwork': 'Selecciona la red de tu preferencia',
      'idle': 'Ocurrio un error inesperado'
    },
    'actions': {
      'back': 'Volver',
      'close': 'Cerrar',
      'support': 'Soporte',
      'scanApp':
          'Escanea con tu celular y continua desde la app de <span class="highlight">Apolo Pay</span>',
      'copy': 'Copiar',
      'copied': '¡Copiado!',
      'payFromDevice': 'Pagar desde este dispositivo',
    },
    'labels': {
      'network': 'Red',
      'address': 'Dirección de depósito',
      'amount': 'Monto',
      'product': 'Producto o Servicio',
      'minutes': 'min',
      'seconds': 'seg',
    },
    'warnings': {
      'networkMatch':
          'Asegúrate de que la <strong>red de tu wallet coincida</strong> con la red de destino.',
      'noNFT': 'No envíes NFTs a esta wallet.',
      'onlyToken':
          'Solo se aceptan <strong>depósitos en {symbol}</strong>. El envío de otro tipo de token podría resultar en su pérdida.',
      'timer':
          'Realiza el pago dentro del tiempo indicado. <strong>{time}</strong> De lo contrario, el código QR se vencerá.',
      'selectNetworkLater': 'Luego podrás seleccionar la red de tu preferencia',
    },
    'success': {
      'message': 'Tu pago fue exitoso y en breve recibirás un correo',
      'message2': 'con los detalles.',
      'details': 'Detalles de la compra',
      'support': 'Cualquier duda o inquietud puedes comunicarte con soporte',
    }
  },
  'errors': {
    'generic': 'Ocurrió un error inesperado.',
    'publicKeyMissing': 'Falta la Public Key',
    'config': 'Error de Configuración',
    'timeout':
        'El tiempo para realizar el pago ha expirado. Por favor genera una nueva orden.',
  }
};
