-- Citas de ejemplo para ver la agenda y el dashboard con datos.
-- Usa la fecha de HOY (CURDATE), así el dashboard siempre muestra "citas de hoy".
-- Ejecútalo después de esquema.sql (o de migracion_servicios.sql).
-- Si lo corres dos veces se duplican las citas de ejemplo.
USE gmv_detailing;

-- 1. Agendado: paquete Premium + un servicio suelto
INSERT INTO citas (cliente, telefono, correo, vehiculo, categoria, fecha, hora, estado)
VALUES ('Carlos Ramírez', '998 111 2233', 'carlos@correo.com', 'Toyota Hilux 2019', 'Toyota', CURDATE(), '09:00:00', 'Agendado');
SET @cita = LAST_INSERT_ID();
INSERT INTO cita_servicios (cita_id, servicio_id, precio_aplicado)
  SELECT @cita, id, precio FROM servicios WHERE id IN ('premium', 'limpieza-de-motor');
INSERT INTO historial_estados (cita_id, estado) VALUES (@cita, 'Agendado');

-- 2. En proceso: paquete Ejecutivo
INSERT INTO citas (cliente, telefono, correo, vehiculo, categoria, fecha, hora, estado)
VALUES ('Mariana López', '998 222 3344', '', 'Honda CR-V 2022', 'Honda', CURDATE(), '10:00:00', 'En proceso');
SET @cita = LAST_INSERT_ID();
INSERT INTO cita_servicios (cita_id, servicio_id, precio_aplicado)
  SELECT @cita, id, precio FROM servicios WHERE id = 'ejecutivo';
INSERT INTO historial_estados (cita_id, estado) VALUES (@cita, 'En proceso');

-- 3. Recibido: paquete Básico
INSERT INTO citas (cliente, telefono, correo, vehiculo, categoria, fecha, hora, estado)
VALUES ('Jorge Herrera', '998 333 4455', 'jorge@correo.com', 'Ford Ranger 2020', 'Ford', CURDATE(), '11:00:00', 'Recibido');
SET @cita = LAST_INSERT_ID();
INSERT INTO cita_servicios (cita_id, servicio_id, precio_aplicado)
  SELECT @cita, id, precio FROM servicios WHERE id = 'basico';
INSERT INTO historial_estados (cita_id, estado) VALUES (@cita, 'Recibido');

-- 4. Terminado: solo servicios sueltos (sin paquete)
INSERT INTO citas (cliente, telefono, correo, vehiculo, categoria, fecha, hora, estado)
VALUES ('Pedro Sánchez', '998 666 7788', 'pedro@correo.com', 'Volkswagen Golf 2021', 'Volkswagen', CURDATE(), '16:00:00', 'Terminado');
SET @cita = LAST_INSERT_ID();
INSERT INTO cita_servicios (cita_id, servicio_id, precio_aplicado)
  SELECT @cita, id, precio FROM servicios WHERE id IN ('aspirado-interior', 'limpieza-de-vidrios');
INSERT INTO historial_estados (cita_id, estado) VALUES (@cita, 'Terminado');

-- Comprobación: 4 citas con sus servicios y el total cobrado.
SELECT c.id, c.cliente, c.hora, c.estado, SUM(cs.precio_aplicado) AS total
FROM citas c JOIN cita_servicios cs ON cs.cita_id = c.id
WHERE c.fecha = CURDATE()
GROUP BY c.id ORDER BY c.hora;
