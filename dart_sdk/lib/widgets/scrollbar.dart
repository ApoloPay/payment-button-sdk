import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class CustomScrollbar extends RawScrollbar {
  CustomScrollbar({
    super.key,
    required super.controller,
    super.thumbVisibility = true,
    Color? thumbColor,
    super.trackVisibility = true,
    super.trackBorderColor = Colors.transparent,
    super.thickness = kIsWeb ? 4 : 0,
    super.radius = const Radius.circular(4),
    required Widget child,
  }) : super(
          thumbColor:
              thumbColor ?? const Color(0xFFEA580C).withValues(alpha: 0.8),
          child: ScrollConfiguration(
            behavior: const ScrollBehavior().copyWith(scrollbars: false),
            child: child,
          ),
        );
}
