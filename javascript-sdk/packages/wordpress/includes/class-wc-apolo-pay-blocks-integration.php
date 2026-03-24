<?php
use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Clase para integrar Apolo Pay con WooCommerce Checkout Blocks
 */
final class WC_Apolo_Pay_Blocks_Integration extends AbstractPaymentMethodType {
    
    /**
     * El nombre de tu pasarela. DEBE coincidir con el $this->id de tu clase principal.
     */
    protected $name = 'apolo_pay';

    /**
     * Inicializa las configuraciones
     */
    public function initialize() {
        // Obtenemos las opciones que el usuario guardó en el panel de WC
        $this->settings = get_option( 'woocommerce_apolo_pay_settings', [] );
    }

    /**
     * Comprueba si la pasarela está activa
     */
    public function is_active() {
        return ! empty( $this->settings['enabled'] ) && 'yes' === $this->settings['enabled'];
    }

    /**
     * Registra el archivo JavaScript que pintará la interfaz en el Checkout
     */
    public function get_payment_method_script_handles() {
        
        // Vamos a registrar un archivo nuevo que crearemos en el Paso 3
        wp_register_script(
            'apolo-pay-blocks-integration',
            plugin_dir_url( dirname(__FILE__) ) . 'assets/checkout-block.js',
            [
                'wc-blocks-registry',
                'wc-settings',
                'wp-element', // Esto es React (proporcionado por WordPress)
                'wp-html-entities',
            ],
            '1.1.0',
            true
        );

        return [ 'apolo-pay-blocks-integration' ];
    }

    /**
     * Pasa datos de PHP a JavaScript
     */
    public function get_payment_method_data() {
        return [
            'title'       => $this->get_setting( 'title' ),
            'description' => $this->get_setting( 'description' ),
            'publicKey'   => $this->get_setting( 'public_key' ),
            'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
            'nonce'       => wp_create_nonce( 'apolo_pay_nonce' ),
        ];
    }
}