import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'screens/inicio_screen.dart';
import 'screens/inicio_sesion_screen.dart';
import 'screens/new_cuenta_screen.dart';
import 'screens/loading_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'GMV Detailing Services',
      initialRoute: '/',
      routes: {
        '/': (_) => const LoadingScreen(),
        '/login': (_) => const LoginScreen(),
        '/registro': (_) => const NewCuentaScreen(),
        '/home': (_) => const HomeScreen(),
      },
    );
  }
}