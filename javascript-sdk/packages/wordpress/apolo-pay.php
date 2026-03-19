<?php
/**
 * Plugin Name: Apolo Pay for WooCommerce
 * Plugin URI:  https://apolopay.app
 * Description: Pasarela de pago oficial de Apolo Pay para WooCommerce. Permite aceptar pagos con tarjeta de forma segura.
 * Version:     1.1.0
 * Author:      Apolo Pay
 * Author URI:  https://apolopay.app
 * Text Domain: apolo-pay
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * WC requires at least: 3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Salida si se accede directamente
}

/**
 * Inicialización del plugin
 */
add_action( 'plugins_loaded', 'init_apolo_pay_gateway_loader' );

function init_apolo_pay_gateway_loader() {
    if ( ! class_exists( 'WC_Payment_Gateway' ) ) return;

    // ✅ Cargamos traducciones ANTES de instanciar la clase
    load_plugin_textdomain('apolo-pay', false, dirname(plugin_basename(__FILE__)) . '/languages');

    require_once plugin_dir_path( __FILE__ ) . 'includes/class-wc-gateway-apolo-pay.php';

    // Instancia para registrar hooks AJAX
    new WC_Gateway_Apolo_Pay();

    add_filter( 'woocommerce_payment_gateways', function($gateways) {
        $gateways[] = 'WC_Gateway_Apolo_Pay';
        return $gateways;
    });
}

/**
 * Agrega la clase a la lista de métodos de pago de WooCommerce
 */
function add_apolo_pay_to_woocommerce( $gateways ) {
    $gateways[] = 'WC_Gateway_Apolo_Pay';
    return $gateways;
}

/**
 * Agregar link de configuración en la lista de plugins (UX mejorada)
 */
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'apolo_pay_action_links' );

function apolo_pay_action_links( $links ) {
    $settings_link = array(
        '<a href="' . admin_url( 'admin.php?page=wc-settings&tab=checkout&section=apolo_pay' ) . '">' . __( 'Configuración', 'apolo-pay' ) . '</a>',
    );
    return array_merge( $settings_link, $links );
}

add_action( 'wp_enqueue_scripts', function() {
    if ( is_checkout() ) {
        wp_enqueue_script( 'apolopay-sdk', plugin_dir_url( __FILE__ ) . 'assets/apolopay-sdk.js', array(), '1.1.0', true );
    }
});