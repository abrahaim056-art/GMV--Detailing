import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static const Color primaryGold = Color(0xFFC89B27);
  static const Color darkCard = Color(0xFF1E1E1E);

  List<dynamic> serviciosList = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _obtenerServiciosBackend();
  }

  // Petición GET al backend de Node.js conectado a MySQL
  Future<void> _obtenerServiciosBackend() async {
    try {
      // Nota: Si usas emulador Android físico usa 'http://10.0.2.2:3000/api/servicios'
      // Si usas Chrome o Windows usa 'http://localhost:3000/api/servicios'
      final response = await http.get(Uri.parse('http://localhost:3000/api/servicios'));

      if (response.statusCode == 200) {
        setState(() {
          serviciosList = json.decode(response.body);
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      debugPrint('Error conectando al backend: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9F9F9),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // BARRA SUPERIOR
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.directions_car, color: primaryGold, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'GMV CONCIERGE',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                          ),
                          Text(
                            'Inicio',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: Colors.black54),
                        onPressed: () {},
                      ),
                      const CircleAvatar(
                        radius: 18,
                        backgroundColor: primaryGold,
                        child: Icon(Icons.person, color: Colors.black, size: 20),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // SALUDO
              const Text('Bienvenido de nuevo', style: TextStyle(color: Colors.grey, fontSize: 13)),
              const Text('Hola, Invitado', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black)),
              const SizedBox(height: 20),

              // TARJETA: AVISO MODO INVITADO / PRÓXIMA CITA
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: darkCard,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(radius: 4, backgroundColor: primaryGold),
                            SizedBox(width: 8),
                            Text(
                              'MODO INVITADO',
                              style: TextStyle(color: primaryGold, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Explora nuestros servicios y precios libremente.',
                      style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Inicia sesión o regístrate cuando desees agendar una cita o guardar tus vehículos.',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color.fromRGBO(255, 255, 255, 0.2)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Iniciar sesión / Registrarse', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                            SizedBox(width: 6),
                            Icon(Icons.login, color: primaryGold, size: 16),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 25),

              // SECCIÓN: NUESTROS SERVICIOS (DESDE MYSQL)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Nuestros servicios',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                  Text(
                    '${serviciosList.length} DISPONIBLES',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // LISTA HORIZONTAL DINÁMICA
              isLoading
                  ? const Center(child: CircularProgressIndicator(color: primaryGold))
                  : serviciosList.isEmpty
                      ? const Text('No hay servicios disponibles en la base de datos.')
                      : SizedBox(
                          height: 140,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: serviciosList.length,
                            itemBuilder: (context, index) {
                              final servicio = serviciosList[index];
                              return Padding(
                                padding: const EdgeInsets.only(right: 12),
                                child: Container(
                                  width: 140,
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.grey.shade200),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF9F9F9),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Icon(Icons.auto_awesome, color: primaryGold, size: 22),
                                      ),
                                      Text(
                                        servicio['nombre'] ?? 'Servicio',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          const Text('\$', style: TextStyle(color: Colors.grey, fontSize: 10)),
                                          Text(
                                            '${servicio['precio'] ?? '0'}',
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
              const SizedBox(height: 20),

              // BANNER DE GARANTIA
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: const Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Color(0xFFF5F5F5),
                      child: Icon(Icons.verified_outlined, color: primaryGold),
                    ),
                    SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Garantía de Acabado GMV', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          SizedBox(height: 2),
                          Text('Cuidado artesanal certificado en cada detalle.', style: TextStyle(color: Colors.grey, fontSize: 11)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}