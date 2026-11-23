import 'package:qr/qr.dart';

/// Generates a QR code for [data] locally (no network, no third-party
/// service) and returns it as an SVG data URI (`data:image/svg+xml;...`).
///
/// Uses error correction level H (~30% recovery) because the payment modal
/// overlays a logo on the center of the QR. The text is encoded as UTF-8
/// bytes (byte mode), same as the JS SDK.
///
/// The SDK's own modal renders the QR with `QrImageView` from the payment
/// address; this data URI only keeps [QrResponseData.qrCodeUrl] usable for
/// integrators that read it.
String generateQrCodeDataUri(String data) {
  const cellSize = 4;
  const margin = 8;

  final qrImage = QrImage(
    QrCode.fromData(data: data, errorCorrectLevel: QrErrorCorrectLevel.H),
  );
  final count = qrImage.moduleCount;
  final size = count * cellSize + margin * 2;

  final path = StringBuffer();
  for (var row = 0; row < count; row++) {
    final y = row * cellSize + margin;
    for (var col = 0; col < count; col++) {
      if (qrImage.isDark(row, col)) {
        final x = col * cellSize + margin;
        path.write(
            'M$x,${y}l$cellSize,0 0,$cellSize -$cellSize,0 0,-${cellSize}z ');
      }
    }
  }

  final svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" '
      'viewBox="0 0 $size $size" preserveAspectRatio="xMinYMin meet">'
      '<rect width="100%" height="100%" fill="white"/>'
      '<path d="$path" stroke="transparent" fill="black"/>'
      '</svg>';

  return 'data:image/svg+xml;charset=utf-8,${Uri.encodeComponent(svg)}';
}
