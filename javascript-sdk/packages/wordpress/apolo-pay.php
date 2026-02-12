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
    
    // 1. Verificar si WooCommerce está activo
    if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
        return;
    }

    // 2. Incluir la clase de la pasarela que definimos antes
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-wc-gateway-apolo-pay.php';

    // Esto evita el error 400 Bad Request
    new WC_Gateway_Apolo_Pay();

    // 3. Registrar la pasarela en WooCommerce
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
