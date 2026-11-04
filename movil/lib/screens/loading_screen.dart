import 'dart:async';
import 'package:flutter/material.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  static const Color primaryGold = Color(0xFFC89B27);
  static const Color darkBackground = Color(0xFF121212);

  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 5), () {
      Navigator.pushReplacementNamed(context, '/registro');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: darkBackground,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: primaryGold.withOpacity(0.5), width: 1.5),
                ),
                child: const Icon(Icons.directions_car, color: primaryGold, size: 40),
              ),
              const SizedBox(height: 24),
              const Text(
                'GMV Detailing Services',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Preparando sistema...',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 40),
              const SizedBox(
                width: 30,
                height: 30,
                child: CircularProgressIndicator(
                  color: primaryGold,
                  strokeWidth: 2.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}