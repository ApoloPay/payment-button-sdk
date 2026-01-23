import 'dart:convert';
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
  final void Function(ClientResponse<QrResponseData> response) onSuccess;
  final void Function(ClientError error) onError;
  final Widget Function(BuildContext context, void Function() handlePress)?
      builder;
  final String label;
  final bool loading;
  final bool disabled;
  final I18nLocale? locale;

  const ApoloPayButton({
    super.key,
    this.client,
    this.processId,
    this.productTitle,
    required this.onSuccess,
    required this.onError,
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

  void handlePress(BuildContext context) {
    if (_hasConfigError ||
        widget.processId == null ||
        widget.processId!.isEmpty ||
        widget.client == null) {
      return;
    }

    ApoloPayModal.show(
      context,
      ApoloPayOptions(
        client: widget.client!,
        processId: widget.processId!,
        productTitle: widget.productTitle ?? '',
        onSuccess: widget.onSuccess,
        onError: widget.onError,
      ),
      productTitle: widget.productTitle,
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isLoading =
        widget.loading || widget.processId == null || widget.processId!.isEmpty;
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
                        : (isLoading
                            ? I18n.t['trigger']['loading']
                            : widget.label),
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
