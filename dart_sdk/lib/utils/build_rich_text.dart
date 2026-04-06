import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

Widget buildRichText(
  String text, {
  Color highlightColor = const Color(0xFF1C315C),
  Color linkColor = const Color(0xFFEA580C),
  TextStyle? baseStyle,
  TextAlign textAlign = TextAlign.start,
}) {
  final List<TextSpan> spans = [];
  final RegExp regExp = RegExp(r'(<[^>]+>|[^<]+)');
  final Iterable<Match> matches = regExp.allMatches(text);

  bool isHighlight = false;
  bool isBold = false;
  String? currentLinkUrl;

  for (final match in matches) {
    final String part = match.group(0)!;

    if (part.startsWith('<')) {
      final tag = part.toLowerCase();

      if (tag.startsWith('<a ')) {
        final hrefMatch = RegExp(r'''href=["'](.*?)["']''').firstMatch(part);
        if (hrefMatch != null) {
          currentLinkUrl = hrefMatch.group(1);
        }
      } else if (tag == '</a>') {
        currentLinkUrl = null;
      } else if (tag.contains('highlight')) {
        isHighlight = true;
      } else if (tag == '</span>') {
        isHighlight = false;
      } else if (tag == '<strong>') {
        isBold = true;
      } else if (tag == '</strong>') {
        isBold = false;
      } else if (tag.startsWith('<br')) {
        spans.add(const TextSpan(text: '\n'));
      }
    } else {
      TapGestureRecognizer? recognizer;

      if (currentLinkUrl != null) {
        final url = currentLinkUrl;
        recognizer = TapGestureRecognizer()
          ..onTap = () async {
            final uri = Uri.parse(url);
            if (uri.hasScheme) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          };
      }

      spans.add(TextSpan(
        text: part,
        style: TextStyle(
          color: currentLinkUrl != null
              ? linkColor
              : (isHighlight || isBold ? highlightColor : null),
          fontWeight: isBold || isHighlight || currentLinkUrl != null
              ? FontWeight.bold
              : null,
          decoration: currentLinkUrl != null ? TextDecoration.underline : null,
        ),
        recognizer: recognizer,
      ));
    }
  }

  return RichText(
    textAlign: textAlign,
    text: TextSpan(
      style:
          baseStyle ?? const TextStyle(color: Color(0xFF1C315C), fontSize: 14),
      children: spans,
    ),
  );
}
