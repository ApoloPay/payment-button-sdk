import 'package:flutter/widgets.dart';
import 'package:nexora_smartpay_sdk/utils/nexora_style.dart';

/// Nexora's mark (isotipo), drawn as a vector so it stays sharp at any size
/// and takes any color (black on light surfaces, white on the black button).
///
/// Same outline as nexora_web's `docs/brand/isotipo.svg` (and the JS SDK's
/// `nexora-mark.ts`), copied from nexora_app's `NexoraMark`.
class NexoraMark extends StatelessWidget {
  const NexoraMark({super.key, this.size = 24, this.color = NexoraStyle.black});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) => Semantics(
        label: 'Nexora',
        image: true,
        child: SizedBox.square(
          dimension: size,
          child: CustomPaint(painter: _MarkPainter(color)),
        ),
      );
}

class _MarkPainter extends CustomPainter {
  const _MarkPainter(this.color);

  final Color color;

  /// Outline loops in a 100 x 100 box, even-odd filled.
  static const _outline = <List<Offset>>[
    [
      Offset(99.48, 3.54),
      Offset(99.62, 3.54),
      Offset(99.69, 3.69),
      Offset(99.75, 5.54),
      Offset(100.00, 61.05),
      Offset(99.89, 64.25),
      Offset(99.44, 67.00),
      Offset(98.69, 69.30),
      Offset(97.77, 71.29),
      Offset(96.41, 73.43),
      Offset(95.07, 75.00),
      Offset(91.01, 78.81),
      Offset(81.19, 87.63),
      Offset(76.45, 91.78),
      Offset(74.52, 93.21),
      Offset(72.06, 94.68),
      Offset(70.50, 95.30),
      Offset(67.53, 96.13),
      Offset(65.75, 96.39),
      Offset(63.71, 96.46),
      Offset(61.49, 96.28),
      Offset(59.32, 95.82),
      Offset(56.71, 94.92),
      Offset(54.64, 93.79),
      Offset(52.23, 92.12),
      Offset(30.46, 73.68),
      Offset(30.26, 73.41),
      Offset(30.21, 72.99),
      Offset(30.20, 49.19),
      Offset(30.24, 48.52),
      Offset(30.37, 48.24),
      Offset(31.29, 48.81),
      Offset(48.02, 61.80),
      Offset(66.21, 76.24),
      Offset(70.56, 79.61),
      Offset(72.43, 80.80),
      Offset(73.53, 81.30),
      Offset(75.22, 81.79),
      Offset(76.38, 81.96),
      Offset(78.42, 81.94),
      Offset(79.40, 81.77),
      Offset(81.41, 81.16),
      Offset(84.01, 79.82),
      Offset(86.34, 78.07),
      Offset(87.94, 76.61),
      Offset(88.04, 76.27),
      Offset(75.37, 66.65),
      Offset(73.99, 65.56),
      Offset(73.84, 65.26),
      Offset(73.81, 30.45),
      Offset(73.87, 28.42),
      Offset(74.18, 26.27),
      Offset(75.00, 23.47),
      Offset(76.04, 21.45),
      Offset(77.48, 19.39),
      Offset(79.44, 17.41),
      Offset(82.96, 14.82),
    ],
    [
      Offset(31.14, 8.45),
      Offset(34.14, 8.48),
      Offset(37.01, 9.00),
      Offset(39.36, 9.85),
      Offset(41.55, 11.01),
      Offset(42.78, 11.82),
      Offset(44.01, 12.77),
      Offset(50.57, 18.60),
      Offset(68.37, 34.76),
      Offset(68.48, 35.12),
      Offset(68.49, 37.45),
      Offset(68.50, 57.41),
      Offset(68.40, 62.30),
      Offset(68.25, 62.37),
      Offset(67.98, 62.23),
      Offset(61.25, 57.03),
      Offset(35.54, 36.40),
      Offset(25.07, 27.78),
      Offset(23.17, 26.34),
      Offset(21.77, 25.55),
      Offset(20.25, 25.05),
      Offset(18.22, 24.77),
      Offset(16.38, 24.89),
      Offset(14.54, 25.36),
      Offset(12.82, 26.26),
      Offset(10.76, 27.70),
      Offset(7.80, 30.55),
      Offset(7.78, 30.82),
      Offset(8.06, 31.11),
      Offset(14.32, 36.06),
      Offset(24.60, 44.29),
      Offset(24.97, 44.77),
      Offset(25.00, 68.62),
      Offset(24.70, 70.79),
      Offset(24.44, 71.82),
      Offset(23.77, 73.49),
      Offset(22.92, 74.97),
      Offset(21.88, 76.40),
      Offset(20.66, 77.66),
      Offset(19.55, 78.59),
      Offset(0.56, 92.37),
      Offset(0.33, 92.49),
      Offset(0.23, 92.40),
      Offset(0.14, 89.75),
      Offset(0.00, 50.27),
      Offset(0.00, 39.92),
      Offset(0.14, 38.03),
      Offset(0.60, 35.88),
      Offset(1.32, 33.84),
      Offset(2.56, 31.59),
      Offset(3.40, 30.39),
      Offset(5.60, 27.93),
      Offset(9.60, 23.77),
      Offset(19.05, 14.13),
      Offset(21.34, 12.20),
      Offset(24.41, 10.31),
      Offset(26.12, 9.54),
      Offset(27.88, 8.99),
    ],
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final scale = size.shortestSide / 100;
    final path = Path()..fillType = PathFillType.evenOdd;
    for (final loop in _outline) {
      path.addPolygon([for (final p in loop) p * scale], true);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..isAntiAlias = true,
    );
  }

  @override
  bool shouldRepaint(_MarkPainter oldDelegate) => oldDelegate.color != color;
}
