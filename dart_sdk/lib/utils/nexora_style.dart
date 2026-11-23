import 'package:flutter/painting.dart';

/// Nexora's visual identity for the button and the payment modal: a
/// monochrome base (black, white and greys from the brand manual) plus sober
/// state colors. Source: nexora_web `docs/brand/README.md`.
class NexoraStyle {
  NexoraStyle._();

  /// Negro Nexora: text, primary buttons, the mark.
  static const Color black = Color(0xFF08090B);

  /// Carbón: dark banners and secondary buttons.
  static const Color carbon = Color(0xFF202328);

  /// Gris medio: secondary text and icons.
  static const Color gray = Color(0xFF6B7078);

  /// Plata: borders.
  static const Color silver = Color(0xFFD9DDE1);

  /// Nube: subtle backgrounds (info banners, partial-payment card).
  static const Color cloud = Color(0xFFF4F5F6);

  /// Surfaces (modal, cards).
  static const Color white = Color(0xFFFFFFFF);

  static const Color success = Color(0xFF1E7A4C);
  static const Color error = Color(0xFFB42332);

  /// Buttons have soft corners, never pills.
  static const double buttonRadius = 10;

  static const RoundedRectangleBorder buttonShape = RoundedRectangleBorder(
    borderRadius: BorderRadius.all(Radius.circular(buttonRadius)),
  );
}
