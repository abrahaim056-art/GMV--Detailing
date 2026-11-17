-- Base de datos de GMV Detailing Services (MySQL) - versión 2
-- Incluye cuentas con roles, vehículos, citas, historial y notificaciones.
CREATE DATABASE IF NOT EXISTS gmv_detailing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gmv_detailing;

-- Cuentas del sistema: clientes (app móvil) y encargado (panel web).
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'encargado') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehículos de cada cliente.
CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Catálogo de servicios.
CREATE TABLE IF NOT EXISTS servicios (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  minutos INT NOT NULL
);

-- Agenda. Si la cita la registró el encargado para alguien sin cuenta
-- (llamada, WhatsApp, local), usuario_id queda vacío y los datos del cliente
-- se guardan en la misma cita.
CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  cliente VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  correo VARCHAR(100),
  vehiculo_id INT NULL,
  vehiculo VARCHAR(100) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Agendado',
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fecha_hora (fecha, hora),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE SET NULL
);

-- Servicios de cada cita, con el precio que tenían ese día.
CREATE TABLE IF NOT EXISTS cita_servicios (
  cita_id INT NOT NULL,
  servicio_id VARCHAR(50) NOT NULL,
  precio_aplicado DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (cita_id, servicio_id),
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- Cada cambio de estado de una cita (seguimiento).
CREATE TABLE IF NOT EXISTS historial_estados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cita_id INT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  cambiado_por INT NULL,
  cambiado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
  FOREIGN KEY (cambiado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Avisos para el cliente (confirmación, estado, finalización).
CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cita_id INT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL
);

-- Servicios ficticios (mismos ids que usa el frontend).
INSERT IGNORE INTO servicios (id, nombre, precio, minutos) VALUES
      ('basico', 'Servicio Básico', 120, 30),
      ('premium', 'Servicio Premium', 220, 60),
      ('ejecutivo', 'Servicio Ejecutivo (Detallado)', 800, 120);

-- Pendiente para después: horario del negocio, días no laborables y bahías.
