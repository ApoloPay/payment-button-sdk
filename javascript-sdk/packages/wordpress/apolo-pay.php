<?php
/**
 * Plugin Name: Nexora SmartPay for WooCommerce
 * Plugin URI:  https://github.com/Nexora-SmartPay/nexora_smartpay_sdk
 * Description: Accept stablecoin payments (USDT) in WooCommerce with the official Nexora SmartPay payment button. Provides a seamless checkout experience for crypto transactions.
 * Version:     2.0.0
 * Author:      Nexora
 * Author URI:  https://smartpaylatam.com
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
define( 'APOLOPAY_VERSION', '2.0.0' );

/**
 * Nexora SmartPay REST API base URL (same default host as the bundled SDK).
 * The constant keeps the APOLOPAY_ prefix used by every identifier of this
 * plugin, so existing installs update in place.
 */
define( 'APOLOPAY_API_BASE_URL', 'https://api.smartpaylatam.com' );

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
 * One-time upgrade routine, run once per plugin version.
 *
 * 2.0.0 (Nexora SmartPay rebrand): a checkout title or description still
 * equal to the pre-2.0 default text is replaced with the new default. Values
 * a merchant customized are never touched.
 */
add_action( 'plugins_loaded', 'apolopay_maybe_upgrade', 5 );

function apolopay_maybe_upgrade() {
    $installed_version = get_option( 'apolopay_plugin_version', '' );
    if ( APOLOPAY_VERSION === $installed_version ) {
        return;
    }

    if ( '' === $installed_version || version_compare( $installed_version, '2.0.0', '<' ) ) {
        $settings = get_option( 'woocommerce_apolo_pay_settings', null );

        if ( is_array( $settings ) ) {
            // Old default => new default. Compared against the exact old text.
            $renamed_defaults = array(
                'title'       => array( 'Pay with ApoloPay', 'Nexora SmartPay' ),
                'description' => array( 'Crypto payments with ApoloPay.', 'Crypto payments with Nexora SmartPay.' ),
            );
            $changed = false;

            foreach ( $renamed_defaults as $key => $defaults ) {
                if ( isset( $settings[ $key ] ) && $defaults[0] === $settings[ $key ] ) {
                    $settings[ $key ] = $defaults[1];
                    $changed          = true;
                }
            }

            if ( $changed ) {
                update_option( 'woocommerce_apolo_pay_settings', $settings );
            }
        }
    }

    update_option( 'apolopay_plugin_version', APOLOPAY_VERSION );
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
