<?php
/**
 * Apolo Pay Payment Gateway Class
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WC_Gateway_Apolo_Pay extends WC_Payment_Gateway {

    public function __construct() {
        $this->id                 = 'apolo_pay';
        
        // CORRECCIÓN ICONO: Usamos la ruta absoluta del archivo principal del plugin para mayor precisión
        $this->icon               = plugins_url( 'assets/icon-2.png', dirname( __FILE__, 2 ) . '/apolo-pay.php' );
        
        $this->has_fields         = true;
        $this->method_title       = __( 'Apolo Pay', 'apolo-pay' );
        $this->method_description = __( 'Accept payments via Apolo Pay securely.', 'apolo-pay' );

        $this->init_form_fields();
        $this->init_settings();

        $this->title       = $this->get_option( 'title' );
        $this->description = $this->get_option( 'description' );
        $this->enabled     = $this->get_option( 'enabled' );
        $this->testmode    = 'yes' === $this->get_option( 'testmode' );
        $this->public_key  = $this->get_option( 'public_key' );
        $this->secret_key  = $this->get_option( 'secret_key' );

        add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'payment_scripts' ) );
        add_action( 'wp_ajax_apolo_pay_create_process', array( $this, 'ajax_create_process' ) );
        add_action( 'wp_ajax_nopriv_apolo_pay_create_process', array( $this, 'ajax_create_process' ) );
    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => __( 'Enable/Disable', 'woocommerce' ),
                'type'    => 'checkbox',
                'label'   => __( 'Enable Apolo Pay Payment', 'apolo-pay' ),
                'default' => 'yes'
            ),
            'title' => array(
                'title'       => __( 'Title', 'woocommerce' ),
                'type'        => 'text',
                'description' => __( 'Title seen during checkout.', 'woocommerce' ),
                'default'     => __( 'Pagar con Apolo Pay', 'apolo-pay' ),
                'desc_tip'    => true,
            ),
            'description' => array(
                'title'       => __( 'Description', 'woocommerce' ),
                'type'        => 'textarea',
                'description' => __( 'Description seen on checkout.', 'woocommerce' ),
                'default'     => __( 'Paga de forma segura con tarjeta de crédito o débito.', 'apolo-pay' ),
                'desc_tip'    => true,
            ),
            'testmode' => array(
                'title'       => __( 'Test mode', 'woocommerce' ),
                'label'       => __( 'Enable Test Mode', 'woocommerce' ),
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            'public_key' => array(
                'title'   => __( 'Public Key', 'apolo-pay' ),
                'type'    => 'text',
                'default' => '',
            ),
            'secret_key' => array(
                'title'   => __( 'Secret Key', 'apolo-pay' ),
                'type'    => 'password',
                'default' => '',
            ),
        );
    }

    public function payment_scripts() {
        if ( ! is_checkout() && ! is_wc_endpoint_url( 'order-pay' ) ) return;
        if ( 'no' === $this->enabled ) return;

        wp_enqueue_script( 'apolopay-sdk', plugin_dir_url( __DIR__ ) . 'assets/apolopay-sdk.js', array(), '1.1.0', true );
        wp_register_script( 'apolopay-checkout', plugin_dir_url( __DIR__ ) . 'assets/apolopay-checkout.js', array( 'jquery', 'apolopay-sdk' ), '1.0.0', true );

        wp_localize_script( 'apolopay-checkout', 'apolo_params', array(
            'ajax_url'   => admin_url( 'admin-ajax.php' ),
            'nonce'      => wp_create_nonce( 'apolo_pay_nonce' ),
            'public_key' => $this->public_key,
        ));

        wp_enqueue_script( 'apolopay-checkout' );
    }

    public function payment_fields() {
        if ( $this->description ) echo wpautop( wp_kses_post( $this->description ) );
        echo '<div id="apolo-pay-form-container">';
        echo '  <payment-button id="apolo-payment-component" style="display:none;" public_key="' . esc_attr( $this->public_key ) . '"></payment-button>';
        echo '  <input type="hidden" id="apolo_transaction_id" name="apolo_transaction_id" />';
        echo '</div>';
    }

    public function ajax_create_process() {
        check_ajax_referer( 'apolo_pay_nonce', 'security' );

        $cart_total = (float) WC()->cart->get_total( 'edit' );

        $body = array(
            'amount'   => $cart_total,
            'metadata' => (object) array()
        );

        // LOG: Enviando solicitud
        error_log( 'APOLO DEBUG: Enviando Preorder con amount ' . $cart_total );

        $response = wp_remote_post( 'https://pb-api.apolopay.app/payment-button/process/preorder', array(
            'method'    => 'POST',
            'headers'   => array(
                'Content-Type' => 'application/json',
                'accept'       => '*/*',
                'x-secret-key' => $this->secret_key 
            ),
            'body'      => json_encode( $body ),
            'timeout'   => 45,
        ));

        if ( is_wp_error( $response ) ) {
            $error_message = $response->get_error_message();
            error_log( 'APOLO DEBUG: Error de WP_Error: ' . $error_message );
            wp_send_json_error( array( 'message' => $error_message ) );
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        $api_data      = json_decode( $response_body, true );

        // LOG: Respuesta completa para inspección
        error_log( 'APOLO DEBUG: HTTP Code ' . $response_code );
        error_log( 'APOLO DEBUG: Body ' . $response_body );

        if ( $response_code < 200 || $response_code >= 300 ) {
            $msg = isset($api_data['message']) ? $api_data['message'] : 'Error API (' . $response_code . ')';
            wp_send_json_error( array( 'message' => $msg ) );
        }

        // Intentamos obtener el ID de varias formas posibles
        $process_id = null;
        if ( isset( $api_data['id'] ) ) $process_id = $api_data['id'];
        else if ( isset( $api_data['process_id'] ) ) $process_id = $api_data['process_id'];
        else if ( isset( $api_data['data']['id'] ) ) $process_id = $api_data['data']['id'];

        if ( ! $process_id ) {
            error_log( 'APOLO DEBUG: No se encontró ID en el JSON' );
            wp_send_json_error( array( 'message' => 'No se encontró el Process ID en la respuesta.' ) );
        }

        wp_send_json_success( array( 'process_id' => $process_id ) );
    }

    public function process_payment( $order_id ) {
        $order = wc_get_order( $order_id );
        $transaction_id = isset( $_POST['apolo_transaction_id'] ) ? sanitize_text_field( $_POST['apolo_transaction_id'] ) : '';

        if ( empty( $transaction_id ) ) {
            wc_add_notice( __( 'Error en confirmación de pago.', 'apolo-pay' ), 'error' );
            return;
        }

        $order->payment_complete( $transaction_id );
        $order->add_order_note( __( 'Pago completado vía Apolo Pay. ID: ' . $transaction_id, 'apolo-pay' ) );
        WC()->cart->empty_cart();

        return array(
            'result'   => 'success',
            'redirect' => $this->get_return_url( $order ),
        );
    }
}