import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AuthProvider extends ChangeNotifier {
  // Android emulador: 'http://10.0.2.2:3000/api'
  static const String baseUrl = 'http://10.0.2.2:3000/api';

  bool isGuest = true;
  String? nombre;
  String? email;
  String? token;

  bool get isLoggedIn => !isGuest;

  /// Devuelve null si todo salió bien, o el mensaje de error.
  Future<String?> login(String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );
      final data = json.decode(res.body);

      if (res.statusCode == 200) {
        _setUser(data);
        return null;
      }
      return data['mensaje'] ?? 'Credenciales incorrectas';
    } catch (e) {
      return 'No se pudo conectar con el servidor';
    }
  }

  Future<String?> register(
      String nombre, String telefono, String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/registro'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'nombre': nombre,
          'telefono': telefono,
          'email': email,
          'password': password,
        }),
      );
      final data = json.decode(res.body);

      if (res.statusCode == 200 || res.statusCode == 201) {
        _setUser(data);
        return null;
      }
      return data['mensaje'] ?? 'No se pudo crear la cuenta';
    } catch (e) {
      return 'No se pudo conectar con el servidor';
    }
  }

  void loginAsGuest() {
    isGuest = true;
    nombre = null;
    email = null;
    token = null;
    notifyListeners();
  }

  void logout() => loginAsGuest();

  void _setUser(Map<String, dynamic> data) {
    isGuest = false;
    nombre = data['nombre'];
    email = data['email'];
    token = data['token'];
    notifyListeners();
  }
}