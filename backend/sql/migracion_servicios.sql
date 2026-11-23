-- Migración para una base de datos que YA tiene la tabla servicios antigua.
-- Ejecútala UNA sola vez en Workbench. Si creas la base desde cero con
-- esquema.sql, NO la necesitas.
USE gmv_detailing;

ALTER TABLE servicios
  ADD COLUMN descripcion VARCHAR(255) NOT NULL DEFAULT '' AFTER nombre,
  ADD COLUMN tipo ENUM('paquete', 'extra') NOT NULL DEFAULT 'extra' AFTER minutos,
  ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE AFTER tipo;

-- Los 3 servicios que ya existían son paquetes.
UPDATE servicios
SET tipo = 'paquete',
    descripcion = 'Lavado exterior, secado a mano y llantas'
WHERE id = 'basico';

UPDATE servicios
SET tipo = 'paquete',
    descripcion = 'Lavado completo, aspirado, vidrios y aromatizante'
WHERE id = 'premium';

UPDATE servicios
SET tipo = 'paquete',
    descripcion = 'Detallado interior, encerado y pulido de pintura'
WHERE id = 'ejecutivo';

-- Servicios sueltos de ejemplo.
INSERT IGNORE INTO servicios (id, nombre, descripcion, precio, minutos, tipo) VALUES
  ('limpieza-de-motor', 'Limpieza de motor', '', 150, 30, 'extra'),
  ('aromatizante-premium', 'Aromatizante premium', '', 60, 5, 'extra'),
  ('proteccion-de-llantas', 'Protección de llantas', '', 90, 15, 'extra'),
  ('limpieza-de-vidrios', 'Limpieza de vidrios', '', 60, 10, 'extra'),
  ('aspirado-interior', 'Aspirado interior', '', 100, 20, 'extra');

-- Comprobación: deben verse 8 filas.
SELECT id, nombre, precio, minutos, tipo, activo FROM servicios ORDER BY tipo, precio;
