import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool obscurePassword = true;
  bool showError = false;

  static const primaryGold = Color(0xFFC89B27);
  static const darkBackground = Color(0xFF121212);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: darkBackground,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 30),
            Center(
              child: Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: primaryGold.withValues(alpha: 0.5),
                    width: 1.5,
                  ),
                ),
                child: const Icon(Icons.directions_car, color: primaryGold, size: 36),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'GMV Detailing Services',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text('Tu auto, como nuevo', style: TextStyle(color: Colors.grey, fontSize: 14)),
            const SizedBox(height: 30),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Iniciar sesión', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.black)),
                      const SizedBox(height: 4),
                      const Text('Ingresa tus credenciales o entra como invitado.', style: TextStyle(color: Colors.black54, fontSize: 13)),
                      const SizedBox(height: 24),
                      const Text('CORREO ELECTRÓNICO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 8),
                      TextField(
                        controller: emailController,
                        decoration: InputDecoration(
                          hintText: 'cliente@ejemplo.com',
                          filled: true,
                          fillColor: const Color(0xFFF5F5F5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text('CONTRASEÑA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 8),
                      TextField(
                        controller: passwordController,
                        obscureText: obscurePassword,
                        decoration: InputDecoration(
                          hintText: '••••••••',
                          filled: true,
                          fillColor: const Color(0xFFF5F5F5),
                          suffixIcon: IconButton(
                            icon: Icon(
                              obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              color: Colors.black38,
                              size: 20,
                            ),
                            onPressed: () => setState(() => obscurePassword = !obscurePassword),
                          ),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                      const SizedBox(height: 24),
                      
                      // BOTÓN INICIAR SESIÓN
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pushReplacementNamed(context, '/home');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryGold,
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Iniciar sesión', style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // NUEVO: BOTÓN CONTINUAR COMO INVITADO
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: OutlinedButton(
                          onPressed: () {
                            // Entra al home permitiendo modo invitado
                            Navigator.pushReplacementNamed(context, '/home');
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: primaryGold, width: 1.5),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: const Text('Continuar como invitado', style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.bold)),
                        ),
                      ),

                      const SizedBox(height: 25),
                      const Divider(color: Color(0xFFEEEEEE)),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('¿Aún no tienes cuenta?', style: TextStyle(color: Colors.black54, fontSize: 13)),
                          GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, '/registro');
                            },
                            child: const Text(
                              ' Registrate',
                              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 13, decoration: TextDecoration.underline),
                            ),
                          ),
                        ],
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