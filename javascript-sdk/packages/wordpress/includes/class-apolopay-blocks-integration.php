<?php
use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Integrates ApoloPay with the WooCommerce Checkout Blocks API.
 */
final class ApoloPay_Blocks_Integration extends AbstractPaymentMethodType {

    /**
     * Must match the $this->id of ApoloPay_Gateway.
     */
    protected $name = 'apolo_pay';

    public function initialize() {
        $this->settings = get_option( 'woocommerce_apolo_pay_settings', array() );
    }

    public function is_active() {
        return ! empty( $this->settings['enabled'] ) && 'yes' === $this->settings['enabled'];
    }

    /**
     * Returns the script handles that WooCommerce Blocks will enqueue.
     *
     * Note: apolopay-sdk is registered here (not just in payment_scripts) so
     * that window.ApoloPaySDK is available in the block checkout context too.
     */
    public function get_payment_method_script_handles() {
        wp_register_script(
            'apolopay-sdk',
            APOLOPAY_PLUGIN_URL . 'assets/apolopay-sdk.js',
            array(),
            APOLOPAY_VERSION,
            true
        );

        wp_register_script(
            'apolopay-blocks-integration',
            APOLOPAY_PLUGIN_URL . 'assets/checkout-block.js',
            array( 'wc-blocks-registry', 'wc-settings', 'wp-element', 'wp-html-entities', 'apolopay-sdk' ),
            APOLOPAY_VERSION,
            true
        );

        return array( 'apolopay-blocks-integration' );
    }

    /**
     * Data passed from PHP to the block JavaScript via getSetting().
     */
    public function get_payment_method_data() {
        return array(
            'title'       => $this->get_setting( 'title' ),
            'description' => $this->get_setting( 'description' ),
            'publicKey'   => $this->get_setting( 'public_key' ),
            'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
            'nonce'       => wp_create_nonce( 'apolopay_nonce' ),
        );
    }
}
