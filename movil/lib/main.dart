import 'package:flutter/material.dart';
import 'package:gmv_detailing_movil/screens/inicio_screen.dart';
import 'package:gmv_detailing_movil/screens/inicio_sesion_screen.dart';
import 'package:gmv_detailing_movil/screens/new_cuenta_screen.dart';
import 'package:gmv_detailing_movil/screens/loading_screen.dart';
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
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFC89B27)),
        useMaterial3: true,
      ),
      initialRoute: '/loading',
routes: {
  '/loading': (context) => const LoadingScreen(),
  '/login': (context) => const LoginScreen(),
  '/registro': (context) => const NewCuentaScreen(),
  '/home': (context) => const HomeScreen(),
},
    );
  }
}