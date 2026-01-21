import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:payment_button_sdk/assets/logo_apolo.dart';
import 'package:payment_button_sdk/i18n/i18n.dart';
import 'package:payment_button_sdk/models/client_response.dart';
import 'package:payment_button_sdk/models/payment_client_models.dart';
import 'payment_modal.dart';

class PaymentButton extends StatefulWidget {
  final String publicKey;
  final double amount;
  final Map<String, dynamic>? metadata;
  final String? productTitle;
  final void Function(ClientResponse<QrResponseData> response) onSuccess;
  final void Function(ClientError error) onError;
  final Widget Function(BuildContext context, void Function() handlePress)?
      builder;
  final String label;
  final bool loading;
  final bool disabled;
  final I18nLocale? locale;

  const PaymentButton({
    super.key,
    required this.publicKey,
    required this.amount,
    this.metadata,
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
  State<PaymentButton> createState() => _PaymentButtonState();
}

class _PaymentButtonState extends State<PaymentButton> {
  @override
  void initState() {
    super.initState();
    if (widget.locale != null) I18n.setLocale(widget.locale!);
  }

  void handlePress(BuildContext context) => PaymentModal.show(
        context,
        PaymentOptions(
          publicKey: widget.publicKey,
          amount: widget.amount,
          metadata: widget.metadata,
          onSuccess: widget.onSuccess,
          onError: widget.onError,
        ),
        productTitle: widget.productTitle,
      );

  @override
  Widget build(BuildContext context) {
    if (widget.builder != null) {
      return widget.builder!(context, () => handlePress(context));
    }

    return InkWell(
      onTap: (widget.disabled || widget.loading)
          ? null
          : () => handlePress(context),
      borderRadius: BorderRadius.circular(9999),
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 200),
        opacity: widget.disabled ? 0.6 : 1.0,
        child: CustomPaint(
          painter: _GradientBorderPainter(
            strokeWidth: 2,
            gradient: const LinearGradient(
              colors: [Color(0xFF0388C0), Colors.white],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
          child: Container(
            height: 48,
            decoration: const ShapeDecoration(
              color: Color(0x25747272),
              shape: StadiumBorder(),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Positioned(
                  left: 16,
                  child: widget.loading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Image.memory(
                          base64Decode(logoApolo),
                          width: 24,
                          height: 24,
                          filterQuality: FilterQuality.high,
                        ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 48, right: 32),
                  child: Text(
                    widget.loading
                        ? I18n.t['trigger']['loading']
                        : widget.label,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
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
