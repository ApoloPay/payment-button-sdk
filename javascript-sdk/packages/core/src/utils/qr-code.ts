import qrcode from 'qrcode-generator';

/**
 * Generates a QR code for `data` locally (no network, no third-party service) and returns it as
 * an SVG data URI (`data:image/svg+xml;...`), usable directly as an `<img src>`.
 *
 * Uses error correction level H (~30% recovery) because the payment modal overlays a logo on
 * the center of the QR. The text is encoded as UTF-8 bytes (byte mode), so non-ASCII input
 * scans the same as it did with the former remote generator.
 */
export function generateQrCodeDataUri(data: string): string {
  const qr = qrcode(0, 'H');
  // qrcode-generator's default byte conversion keeps only the low byte of each UTF-16 unit,
  // so hand it the UTF-8 bytes as a binary string.
  const utf8Bytes = new TextEncoder().encode(data);
  let binary = '';
  for (const byte of utf8Bytes) binary += String.fromCharCode(byte);
  qr.addData(binary, 'Byte');
  qr.make();

  const svg = qr.createSvgTag({ cellSize: 4, margin: 8, scalable: true });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
