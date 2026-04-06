import 'dart:async';
import 'package:apolopay_sdk/i18n/i18n.dart';
import 'package:apolopay_sdk/utils/build_rich_text.dart';
import 'package:apolopay_sdk/widgets/scrollbar.dart';
import 'package:flutter/material.dart';

class InfoModal extends StatefulWidget {
  final String title;
  final String? subtitle;
  final Widget Function(BuildContext context, TextStyle style)? content;

  const InfoModal({
    super.key,
    this.title = '',
    this.subtitle,
    this.content,
  });

  static Future<bool?> show(
    BuildContext context, {
    String title = '',
    String? subtitle,
    Widget Function(BuildContext context, TextStyle style)? content,
  }) async {
    return await showDialog<bool?>(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480, maxHeight: 800),
          child: InfoModal(
            title: title,
            subtitle: subtitle,
            content: content,
          ),
        ),
      ),
    );
  }

  @override
  State<InfoModal> createState() => _InfoModalState();
}

class _InfoModalState extends State<InfoModal> {
  final scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    void handleClose([bool didPop = false, bool result = false]) {
      if (!didPop) Navigator.pop(context, result);
    }

    return PopScope(
      onPopInvokedWithResult: (didPop, result) => handleClose(didPop),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 600),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: const BoxDecoration(
          color: Color(0xFFF6F2EC),
          borderRadius: BorderRadius.all(Radius.circular(24)),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Align(
              alignment: Alignment.centerRight,
              child: IconButton(
                icon: const Icon(Icons.close, color: Color(0xFF9CA3AF)),
                onPressed: handleClose,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              buildRichText(
                widget.title,
                baseStyle: const TextStyle(
                  color: Color(0xFF1C315C),
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              if (widget.subtitle != null) ...[
                const SizedBox(height: 8),
                Text(
                  widget.subtitle!,
                  textAlign: TextAlign.center,
                  style:
                      const TextStyle(color: Color(0xFF6B7280), fontSize: 14),
                ),
              ],
              const SizedBox(height: 24),
              if (widget.content != null)
                Container(
                  constraints: const BoxConstraints(maxHeight: 350),
                  child: CustomScrollbar(
                    controller: scrollController,
                    child: SingleChildScrollView(
                      controller: scrollController,
                      child: widget.content!(
                        context,
                        const TextStyle(
                          color: Color(0xFF1C315C),
                          fontSize: 13,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                ),
            ]),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: SizedBox(
              width: double.maxFinite,
              child: ElevatedButton(
                onPressed: () => handleClose(false, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  foregroundColor: Colors.white,
                  shape: const StadiumBorder(),
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                ),
                child: Text(I18n.t.modal.actions.understood),
              ),
            ),
          ),
        ]),
      ),
    );
  }
}
