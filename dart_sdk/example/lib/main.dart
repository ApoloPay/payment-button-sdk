import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:apolopay_sdk/apolopay_sdk.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const ApoloPlaygroundApp());
}

class ApoloPlaygroundApp extends StatelessWidget {
  const ApoloPlaygroundApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Apolo Pay Playground',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0A0B),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0070F3),
          primary: const Color(0xFF0070F3),
          surface: const Color(0xFF121214),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF0A0A0B),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Color(0xFF2D2D33)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Color(0xFF2D2D33)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Color(0xFF0070F3), width: 2),
          ),
          hintStyle: const TextStyle(color: Color(0xFFA1A1A1), fontSize: 14),
          labelStyle: const TextStyle(color: Color(0xFFA1A1A1), fontSize: 14),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF1A1A1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF2D2D33)),
          ),
          elevation: 0,
        ),
      ),
      home: const PlaygroundPage(),
    );
  }
}

class LogEntry {
  final String message;
  final String type; // 'system' | 'success' | 'error' | 'info'
  final DateTime time;

  LogEntry(this.message, this.type) : time = DateTime.now();
}

class PlaygroundPage extends StatefulWidget {
  const PlaygroundPage({super.key});

  @override
  State<PlaygroundPage> createState() => _PlaygroundPageState();
}

class _PlaygroundPageState extends State<PlaygroundPage> {
  // Config
  final _pubKeyController = TextEditingController();
  final _privKeyController = TextEditingController();
  final _amountController = TextEditingController(text: "1");

  // State
  ApoloPayClient? _client;
  String? _processId;
  bool _isLoading = false;
  String _status = "Esperando configuración...";
  final List<LogEntry> _logs = [];

  @override
  void initState() {
    super.initState();
    _addLog("Playground iniciado...", "system");
  }

  void _addLog(String message, String type) {
    setState(() {
      _logs.insert(0, LogEntry(message, type));
    });
  }

  void _clearLogs() {
    setState(() {
      _logs.clear();
    });
  }

  Future<String> _getProcessId(double amount, String secretKey) async {
    final response = await http.post(
      Uri.parse("https://pb-api.apolopay.app/payment-button/process/preorder"),
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: jsonEncode({"amount": amount}),
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['message'] ?? "Error al obtener processId");
    }

    final data = jsonDecode(response.body);
    return data['result']['id'];
  }

  Future<void> _handleUpdate() async {
    final pubKey = _pubKeyController.text.trim();
    final privKey = _privKeyController.text.trim();
    final amountText = _amountController.text.trim();

    if (pubKey.isEmpty || privKey.isEmpty || amountText.isEmpty) {
      _addLog("Por favor, completa todos los campos correctamente", "error");
      return;
    }

    final amount = double.tryParse(amountText);
    if (amount == null) {
      _addLog("Monto inválido", "error");
      return;
    }

    setState(() {
      _isLoading = true;
      _status = "Obteniendo processId...";
    });
    _addLog("Iniciando configuración (Monto: $amount)...", "info");

    try {
      final newProcessId = await _getProcessId(amount, privKey);
      _addLog("Process ID obtenido: $newProcessId", "success");

      setState(() {
        _client = ApoloPayClient(publicKey: pubKey);
        _processId = newProcessId;
        _status = "Botón Listo ✅";
      });
      _addLog("Botón listo para usar", "success");
    } catch (e) {
      debugPrint(e.toString());
      _addLog("Error: ${e.toString().replaceAll("Exception: ", "")}", "error");
      setState(() {
        _status = "Error en configuración";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth > 800;

          if (isWide) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  width: 350,
                  child: _buildSidebar(),
                ),
                Expanded(
                  child: _buildMainArea(),
                ),
              ],
            );
          } else {
            return SingleChildScrollView(
              child: Column(
                children: [
                  _buildSidebar(isScrollable: false),
                  const Divider(height: 1, color: Color(0xFF2D2D33)),
                  _buildMainArea(isScrollable: false),
                ],
              ),
            );
          }
        },
      ),
    );
  }

  Widget _buildSidebar({bool isScrollable = true}) {
    final content = Container(
      color: const Color(0xFF121214),
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          const SizedBox(height: 32),
          _buildConfigSection(),
          const SizedBox(height: 32),
          _buildStatusPanel(),
        ],
      ),
    );

    return isScrollable ? SingleChildScrollView(child: content) : content;
  }

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              "Apolo",
              style: TextStyle(
                color: Color(0xFF0070F3),
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
            ),
            Text(
              " Pay",
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        SizedBox(height: 8),
        Text(
          "PLAYGROUND FLUTTER",
          style: TextStyle(
            color: Color(0xFFA1A1A1),
            fontSize: 12,
            fontWeight: FontWeight.w600,
            letterSpacing: 2,
          ),
        ),
      ],
    );
  }

  Widget _buildConfigSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildInputGroup("Public Key (pk_...)", _pubKeyController, "pk_...",
            obscure: false),
        const SizedBox(height: 24),
        _buildInputGroup(
            "Private Key (Secret Key)", _privKeyController, "sk_...",
            obscure: true),
        const Text(
          "Solo para uso local en este playground",
          style: TextStyle(
              color: Colors.orangeAccent,
              fontSize: 11,
              fontStyle: FontStyle.italic),
        ),
        const SizedBox(height: 24),
        _buildInputGroup("Monto (Amount)", _amountController, "1.00",
            obscure: false, keyboardType: TextInputType.number),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: _isLoading ? null : _handleUpdate,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0070F3),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            disabledBackgroundColor:
                const Color(0xFF0070F3).withValues(alpha: 0.5),
          ),
          child: _isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                      strokeWidth: 2, color: Colors.white))
              : const Text("Configurar Botón",
                  style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildInputGroup(
      String label, TextEditingController controller, String hint,
      {required bool obscure, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
              color: Color(0xFFA1A1A1),
              fontSize: 13,
              fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(hintText: hint),
        ),
      ],
    );
  }

  Widget _buildStatusPanel() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _buildStatusItem("Estado:", _status),
          if (_processId != null) ...[
            const SizedBox(height: 12),
            _buildStatusItem("Process ID:", _processId!, isCode: true),
          ],
        ],
      ),
    );
  }

  Widget _buildStatusItem(String label, String value, {bool isCode = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: const TextStyle(color: Color(0xFFA1A1A1), fontSize: 13)),
        const SizedBox(width: 16),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: isCode ? const Color(0xFF0070F3) : Colors.white,
              fontSize: isCode ? 11 : 13,
              fontFamily: isCode ? 'monospace' : null,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMainArea({bool isScrollable = true}) {
    final content = Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.topRight,
          radius: 1.5,
          colors: [Color(0x0D0070F3), Colors.transparent],
        ),
      ),
      padding: const EdgeInsets.all(48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildPreviewCard(),
          const SizedBox(height: 32),
          _buildLogsPanel(),
        ],
      ),
    );

    return isScrollable ? SingleChildScrollView(child: content) : content;
  }

  Widget _buildPreviewCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(48),
        child: Column(
          children: [
            const Text("Vista Previa",
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text(
              "Aquí es donde aparecerá tu botón de pago configurado",
              style: TextStyle(color: Color(0xFFA1A1A1)),
            ),
            const SizedBox(height: 48),
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: const Color(0xFF2D2D33), style: BorderStyle.solid),
              ),
              alignment: Alignment.center,
              child: _processId == null || _client == null
                  ? const Text("Configura las llaves para ver el botón",
                      style: TextStyle(
                          color: Color(0xFFA1A1A1),
                          fontStyle: FontStyle.italic))
                  : ApoloPayButton(
                      client: _client,
                      processId: _processId,
                      onSuccess: (ctx, res) =>
                          _addLog("PAGO EXITOSO: ${res.message}", "success"),
                      onError: (ctx, err) =>
                          _addLog("ERROR EN PAGO: ${err.message}", "error"),
                      onExpired: (ctx, err) => _addLog(
                          "EL PAGO HA EXPIRADO: ${err.message}", "error"),
                      onDismissed: () =>
                          _addLog("Pago cancelado por el usuario", "system"),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogsPanel() {
    return Container(
      height: 400,
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2D2D33)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("REGISTRO DE EVENTOS",
                    style: TextStyle(
                        color: Color(0xFFA1A1A1),
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1)),
                TextButton(
                  onPressed: _clearLogs,
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFFA1A1A1),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    side: const BorderSide(color: Color(0xFF2D2D33)),
                  ),
                  child: const Text("Limpiar", style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFF2D2D33)),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _logs.length,
              separatorBuilder: (context, index) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final log = _logs[index];
                Color color;
                switch (log.type) {
                  case 'success':
                    color = const Color(0xFF00C853);
                    break;
                  case 'error':
                    color = const Color(0xFFFF3D00);
                    break;
                  case 'info':
                    color = const Color(0xFF0070F3);
                    break;
                  default:
                    color = const Color(0xFF888888);
                }
                return Text(
                  "[${log.time.hour.toString().padLeft(2, '0')}:${log.time.minute.toString().padLeft(2, '0')}:${log.time.second.toString().padLeft(2, '0')}] ${log.message}",
                  style: TextStyle(
                      color: color, fontFamily: 'monospace', fontSize: 12),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
