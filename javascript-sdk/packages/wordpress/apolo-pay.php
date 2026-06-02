<?php
/**
 * Plugin Name: ApoloPay Checkout for WooCommerce
 * Plugin URI:  https://github.com/ApoloPay/payment-button-sdk
 * Description: Accept payments with ease using the official ApoloPay integration for WooCommerce. Provides a seamless checkout experience for stablecoin transactions (USDT).
 * Version:     1.2.0
 * Author:      ApoloPay
 * Author URI:  https://apolopay.app
 * Text Domain: apolopay-checkout-for-woocommerce
 * Domain Path: /languages
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Tested up to: 7.0
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * WC requires at least: 3.0
 * Requires Plugins: woocommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'APOLOPAY_PLUGIN_FILE', __FILE__ );
define( 'APOLOPAY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'APOLOPAY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'APOLOPAY_VERSION', '1.2.0' );

/**
 * Bootstrap the payment gateway after WooCommerce loads.
 */
add_action( 'plugins_loaded', 'apolopay_init_gateway' );

function apolopay_init_gateway() {
    if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
        return;
    }

    require_once APOLOPAY_PLUGIN_DIR . 'includes/class-apolopay-gateway.php';

    // Instantiate to register AJAX hooks inside the constructor.
    new ApoloPay_Gateway();

    add_filter( 'woocommerce_payment_gateways', function ( $gateways ) {
        $gateways[] = 'ApoloPay_Gateway';
        return $gateways;
    } );
}

/**
 * Register the gateway with WooCommerce Checkout Blocks.
 */
add_action( 'woocommerce_blocks_payment_method_type_registration', 'apolopay_register_blocks' );

function apolopay_register_blocks( $payment_method_registry ) {
    if ( ! class_exists( '\Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
        return;
    }

    require_once APOLOPAY_PLUGIN_DIR . 'includes/class-apolopay-blocks-integration.php';

    $payment_method_registry->register( new ApoloPay_Blocks_Integration() );
}

/**
 * Add a Settings link on the Plugins list page.
 */
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'apolopay_action_links' );

function apolopay_action_links( $links ) {
    $settings_link = array(
        '<a href="' . esc_url( admin_url( 'admin.php?page=wc-settings&tab=checkout&section=apolo_pay' ) ) . '">'
            . esc_html__( 'Settings', 'apolopay-checkout-for-woocommerce' )
        . '</a>',
    );
    return array_merge( $settings_link, $links );
}
