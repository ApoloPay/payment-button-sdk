import 'dart:convert';
import 'package:apolopay_sdk/utils/build_rich_text.dart';
import 'package:apolopay_sdk/widgets/info_modal.dart';
import 'package:flutter/material.dart';
import 'package:apolopay_sdk/assets/logo_apolo.dart';
import 'package:apolopay_sdk/i18n/i18n.dart';
import 'package:apolopay_sdk/models/client_response.dart';
import 'package:apolopay_sdk/models/apolopay_models.dart';
import 'package:apolopay_sdk/services/apolo_pay_client.dart';
import 'apolopay_modal.dart';

class ApoloPayButton extends StatefulWidget {
  final ApoloPayClient? client;
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
  final Widget Function(
      BuildContext context, Future<void> Function() handlePress)? builder;
  final String label;
  final bool loading;
  final bool disabled;
  final I18nLocale? locale;

  const ApoloPayButton({
    super.key,
    this.client,
    this.processId,
    this.productTitle,
    this.onSuccess,
    this.onPartialPayment,
    this.onError,
    this.onExpired,
    this.builder,
    this.label = 'Apolo Pay',
    this.loading = false,
    this.disabled = false,
    this.locale,
  });

  @override
  State<ApoloPayButton> createState() => _ApoloPayButtonState();
}

class _ApoloPayButtonState extends State<ApoloPayButton> {
  bool _hasConfigError = false;
  bool _alreadyShownInfoModal = false;

  @override
  void initState() {
    super.initState();
    if (widget.locale != null) I18n.setLocale(widget.locale!);
    _validateConfig();
  }

  @override
  void didUpdateWidget(covariant ApoloPayButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    _validateConfig();
  }

  void _validateConfig() {
    if (widget.client == null) {
      _hasConfigError = true;
      return;
    }

    final key = widget.client!.getPublicKey();
    final isValid = key.startsWith('pk_') && key.length == 35;

    setState(() {
      _hasConfigError = !isValid;
    });

    if (!isValid) {
      debugPrint(
          'ApoloPayButton Error: Invalid publicKey "$key". Must start with "pk_" and be 35 characters long.');
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
      if (response != true || !context.mounted) return;
      _alreadyShownInfoModal = true;
    }

    await ApoloPayModal.show(
      context,
      ApoloPayOptions(
        client: widget.client!,
        processId: widget.processId!,
        onSuccess: (res) => widget.onSuccess?.call(context, res),
        onPartialPayment: (res) => widget.onPartialPayment?.call(context, res),
        onError: (err) => widget.onError?.call(context, err),
      ),
      locale: widget.locale,
      productTitle: widget.productTitle ?? '',
      onExpired: (err) => widget.onExpired?.call(context, err),
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

    return InkWell(
      onTap: isDisabled ? null : () => handlePress(context),
      borderRadius: BorderRadius.circular(9999),
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 200),
        opacity: widget.disabled ? 0.6 : 1.0,
        child: CustomPaint(
          painter: _GradientBorderPainter(
            strokeWidth: 2,
            gradient: LinearGradient(
              colors: _hasConfigError
                  ? [Colors.red, Colors.redAccent]
                  : [const Color(0xFF0388C0), Colors.white],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
          child: Container(
            height: 48,
            decoration: ShapeDecoration(
              color: _hasConfigError
                  ? Colors.red.withOpacity(0.1)
                  : const Color(0x25747272),
              shape: const StadiumBorder(),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Positioned(
                  left: 16,
                  child: isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : (_hasConfigError
                          ? const Icon(Icons.error_outline,
                              color: Colors.red, size: 24)
                          : Image.memory(
                              base64Decode(logoApolo),
                              width: 24,
                              height: 24,
                              filterQuality: FilterQuality.high,
                            )),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 48, right: 32),
                  child: Text(
                    _hasConfigError
                        ? 'Config Error'
                        : (isLoading ? I18n.t.trigger.loading : widget.label),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: _hasConfigError ? Colors.red : Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
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

class _GradientBorderPainter extends CustomPainter {
  final double strokeWidth;
  final Gradient gradient;

  _GradientBorderPainter({required this.strokeWidth, required this.gradient});

  @override
  void paint(Canvas canvas, Size size) {
    final Rect rect = Offset.zero & size;
    final Paint paint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final RRect rrect = RRect.fromRectAndRadius(
      rect,
      Radius.circular(size.height / 2),
    );

    canvas.drawRRect(rrect, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
