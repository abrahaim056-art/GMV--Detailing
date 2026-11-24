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

-- Directorio de clientes que registra el encargado en el panel web.
-- usuario_id queda vacío si el cliente no tiene cuenta en la app móvil.
-- Al quitar un cliente se pone activo = FALSE en vez de borrarlo.
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NULL,
  correo VARCHAR(100) NULL,
  usuario_id INT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Vehículos de cada cliente.
CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Catálogo de servicios. "tipo" distingue los paquetes de los servicios sueltos
-- (extras que se suman a un paquete o se piden solos). Al quitar un servicio se
-- pone activo = FALSE en vez de borrarlo, para no perder el historial de las citas.
CREATE TABLE IF NOT EXISTS servicios (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL DEFAULT '',
  precio DECIMAL(10, 2) NOT NULL,
  minutos INT NOT NULL,
  tipo ENUM('paquete', 'extra') NOT NULL DEFAULT 'extra',
  activo BOOLEAN NOT NULL DEFAULT TRUE
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

-- Datos de prueba: 3 paquetes y 5 servicios sueltos.
INSERT IGNORE INTO servicios (id, nombre, descripcion, precio, minutos, tipo) VALUES
  ('basico', 'Servicio Básico', 'Lavado exterior, secado a mano y llantas', 120, 30, 'paquete'),
  ('premium', 'Servicio Premium', 'Lavado completo, aspirado, vidrios y aromatizante', 220, 60, 'paquete'),
  ('ejecutivo', 'Servicio Ejecutivo (Detallado)', 'Detallado interior, encerado y pulido de pintura', 800, 120, 'paquete'),
  ('limpieza-de-motor', 'Limpieza de motor', '', 150, 30, 'extra'),
  ('aromatizante-premium', 'Aromatizante premium', '', 60, 5, 'extra'),
  ('proteccion-de-llantas', 'Protección de llantas', '', 90, 15, 'extra'),
  ('limpieza-de-vidrios', 'Limpieza de vidrios', '', 60, 10, 'extra'),
  ('aspirado-interior', 'Aspirado interior', '', 100, 20, 'extra');

-- Pendiente para después: horario del negocio, días no laborables y bahías.
