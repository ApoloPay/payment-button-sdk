import { describe, it, expect, vi, afterEach } from 'vitest';
import qrcode from 'qrcode-generator';
import { generateQrCodeDataUri } from './qr-code';

describe('generateQrCodeDataUri', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an SVG data URI generated locally, without touching the network', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const uri = generateQrCodeDataUri('0x1a2b3c4d5e6f');

    expect(uri.startsWith('data:image/svg+xml')).toBe(true);
    expect(decodeURIComponent(uri)).toContain('<svg');
    expect(uri).not.toContain('http%3A%2F%2Fapi');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes exactly the given data with error correction H (logo overlay)', () => {
    const data = 'https://p2p.apolopay.app/payment-process/proc-1';
    const expected = qrcode(0, 'H');
    expected.addData(data, 'Byte');
    expected.make();

    const uri = generateQrCodeDataUri(data);

    expect(uri).toBe(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(expected.createSvgTag({ cellSize: 4, margin: 8, scalable: true }))}`
    );
  });

  it('is deterministic and differs per input', () => {
    expect(generateQrCodeDataUri('a')).toBe(generateQrCodeDataUri('a'));
    expect(generateQrCodeDataUri('a')).not.toBe(generateQrCodeDataUri('b'));
  });

  it('handles non-ASCII text (sandbox placeholder copy)', () => {
    expect(generateQrCodeDataUri('Código de prueba ñ').startsWith('data:image/svg+xml')).toBe(true);
  });
});
