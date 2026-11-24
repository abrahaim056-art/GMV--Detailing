-- Crea la tabla clientes si todavía no existe en tu base de datos.
-- Es seguro correrla varias veces (si la tabla ya existe, no hace nada).
USE gmv_detailing;

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

SELECT id, nombre, telefono, correo, usuario_id, activo, creado_en FROM clientes ORDER BY id;