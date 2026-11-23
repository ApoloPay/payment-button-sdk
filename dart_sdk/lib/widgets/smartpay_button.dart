import 'package:nexora_smartpay_sdk/utils/build_rich_text.dart';
import 'package:nexora_smartpay_sdk/widgets/info_modal.dart';
import 'package:flutter/material.dart';
import 'package:nexora_smartpay_sdk/assets/nexora_mark.dart';
import 'package:nexora_smartpay_sdk/utils/nexora_style.dart';
import 'package:nexora_smartpay_sdk/i18n/i18n.dart';
import 'package:nexora_smartpay_sdk/models/client_response.dart';
import 'package:nexora_smartpay_sdk/models/smartpay_models.dart';
import 'package:nexora_smartpay_sdk/services/smart_pay_client.dart';
import 'smartpay_modal.dart';

class SmartPayButton extends StatefulWidget {
  final SmartPayClient? client;
  final String? processId;
  final String? productTitle;
  final void Function(
    BuildContext context,
    ClientResponse<QrResponseData> response,
  )? onSuccess;
  final void Function(
    BuildContext context,
    ClientResponse<PartialPaymentResponseData> response,
  )? onPartialPayment;
  final void Function(BuildContext context, ClientError error)? onError;
  final void Function(BuildContext context, ClientError error)? onExpired;
  final VoidCallback? onDismissed;
  final Widget Function(
      BuildContext context, Future<void> Function() handlePress)? builder;
  final String label;
  final bool loading;
  final bool disabled;
  final I18nLocale? locale;

  const SmartPayButton({
    super.key,
    this.client,
    this.processId,
    this.productTitle,
    this.onSuccess,
    this.onPartialPayment,
    this.onError,
    this.onExpired,
    this.onDismissed,
    this.builder,
    this.label = 'Nexora',
    this.loading = false,
    this.disabled = false,
    this.locale,
  });

  @override
  State<SmartPayButton> createState() => _SmartPayButtonState();
}

class _SmartPayButtonState extends State<SmartPayButton> {
  bool _hasConfigError = false;
  bool _alreadyShownInfoModal = false;

  @override
  void initState() {
    super.initState();
    if (widget.locale != null) I18n.setLocale(widget.locale!);
    _validateConfig();
  }

  @override
  void didUpdateWidget(covariant SmartPayButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    _validateConfig();
  }

  void _validateConfig() {
    if (widget.client == null) {
      _hasConfigError = true;
      return;
    }

    final key = widget.client!.getPublicKey();
    // Sandbox (pk_test...) keys are not required to match the live key length.
    final isValid = key.startsWith('pk_') &&
        (key.startsWith('pk_test') || key.length == 35);

    setState(() {
      _hasConfigError = !isValid;
    });

    if (!isValid) {
      debugPrint(
          'SmartPayButton Error: Invalid publicKey "$key". Must start with "pk_" and be 35 characters long.');
    }
  }

  Future<void> handlePress(BuildContext context) async {
    if (_hasConfigError ||
        widget.processId == null ||
        widget.processId!.isEmpty ||
        widget.client == null) {
      return;
    }

    if (!_alreadyShownInfoModal) {
      final response = await InfoModal.show(
        context,
        title: I18n.t.modal.info.disclaimerTitle,
        subtitle: I18n.t.modal.info.disclaimerSubtitle,
        content: (context, style) {
          return buildRichText(
            I18n.t.modal.info.disclaimerBody,
            baseStyle: style,
          );
        },
      );
      if (response != true) return widget.onDismissed?.call();
      _alreadyShownInfoModal = true;
    }

    if (!context.mounted) return;
    await SmartPayModal.show(
      context,
      SmartPayOptions(
        client: widget.client!,
        processId: widget.processId!,
        onSuccess: (res) => widget.onSuccess?.call(context, res),
        onPartialPayment: (res) => widget.onPartialPayment?.call(context, res),
        onError: (err) => widget.onError?.call(context, err),
      ),
      locale: widget.locale,
      productTitle: widget.productTitle ?? '',
      onExpired: (err) => widget.onExpired?.call(context, err),
      onDismissed: widget.onDismissed,
    );
  }

  bool get isValidProcessId {
    if (widget.processId == null || widget.processId!.isEmpty) return false;
    final uuidRegex = RegExp(
        r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    return uuidRegex.hasMatch(widget.processId!);
  }

  @override
  Widget build(BuildContext context) {
    final bool isLoading = widget.loading || !isValidProcessId;
    final bool isDisabled = widget.disabled || _hasConfigError || isLoading;

    if (widget.builder != null) {
      return widget.builder!(context, () => handlePress(context));
    }

    // Nexora's primary button: black with white text and the white mark;
    // soft corners (not a pill). Config errors get a white button with the
    // error color.
    final Color foreground =
        _hasConfigError ? NexoraStyle.error : NexoraStyle.white;

    return Material(
      color: _hasConfigError ? NexoraStyle.white : NexoraStyle.black,
      shape: _hasConfigError
          ? NexoraStyle.buttonShape.copyWith(
              side: const BorderSide(color: NexoraStyle.error, width: 1.5),
            )
          : NexoraStyle.buttonShape,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: isDisabled ? null : () => handlePress(context),
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 200),
          opacity: widget.disabled ? 0.6 : 1.0,
          child: SizedBox(
            height: 48,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Positioned(
                  left: 16,
                  child: isLoading
                      ? SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: foreground,
                          ),
                        )
                      : (_hasConfigError
                          ? Icon(Icons.error_outline,
                              color: foreground, size: 24)
                          : NexoraMark(size: 24, color: foreground)),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 48, right: 32),
                  child: Text(
                    _hasConfigError
                        ? 'Config Error'
                        : (isLoading ? I18n.t.trigger.loading : widget.label),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: foreground,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
