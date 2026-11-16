import 'dart:async';
import 'package:flutter/material.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  Timer? _navigationTimer;

  static const Color primaryGold = Color(0xFFC89B27);
  static const Color darkBackground = Color(0xFF121212);

  @override
  void initState() {
    super.initState();
    // Temporizador de 3 segundos (puedes cambiar los segundos si lo prefieres)
    _navigationTimer = Timer(const Duration(seconds: 3), () {
      if (!mounted) return;
      // Redirige al login usando rutas nombradas
      Navigator.pushReplacementNamed(context, '/login');
    });
  }

  @override
  void dispose() {
    _navigationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: darkBackground,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: primaryGold.withValues(alpha: 0.5), width: 1.5),
              ),
              child: const Icon(Icons.directions_car, size: 40, color: primaryGold),
            ),
            const SizedBox(height: 20),
            const Text(
              'Cargando...',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 20),
            const Text(
              'GMV Detailing Services',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 30),
            const CircularProgressIndicator(color: primaryGold),
          ],
        ),
      ),
    );
  }
}