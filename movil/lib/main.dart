import 'package:flutter/material.dart';
import 'package:gmv_detailing_movil/screens/inicio_screens.dart'; // Ajusta la ruta de tu importación

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'GMV Detailing',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const InicioScreen(),
    );
  }
}