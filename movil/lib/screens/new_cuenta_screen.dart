import 'package:flutter/material.dart';

class NewCuentaScreen extends StatelessWidget {
  const NewCuentaScreen({super.key});

  static const Color primaryGold = Color(0xFFC89B27);
  static const Color darkBackground = Color(0xFF121212);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: darkBackground,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                    child: const Row(
                      children: [
                        CircleAvatar(radius: 3, backgroundColor: primaryGold),
                        SizedBox(width: 6),
                        Text('GMV CONCIERGE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Crea tu cuenta', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black)),
                      const SizedBox(height: 6),
                      const Text('Solo necesitamos unos datos para agendar tus citas', style: TextStyle(color: Colors.black54, fontSize: 13)),
                      const SizedBox(height: 24),
                      const Text('Nombre completo', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 8),
                      TextField(
                        decoration: InputDecoration(
                          hintText: 'Ej. Carlos Mendoza',
                          filled: true,
                          fillColor: const Color(0xFFF9F9F9),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                      ),
                      const SizedBox(height: 18),
                      const Text('Teléfono', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 8),
                      TextField(
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          hintText: 'Ej. +52 55 1234 5678',
                          filled: true,
                          fillColor: const Color(0xFFF9F9F9),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                      ),
                      const SizedBox(height: 18),
                      const Text('Correo electrónico', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 8),
                      TextField(
                        keyboardType: TextInputType.emailAddress,
                        decoration: InputDecoration(
                          hintText: 'carlos.mendoza@',
                          filled: true,
                          fillColor: const Color(0xFFF9F9F9),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            // Al crear cuenta con éxito, lo mandamos directo al Home
                            Navigator.pushReplacementNamed(context, '/home');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryGold,
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Crear cuenta', style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Center(
                        child: GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Text(
                            '¿Ya tienes cuenta? Inicia sesión',
                            style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 13, decoration: TextDecoration.underline),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}