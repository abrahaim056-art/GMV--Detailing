import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Cliente, DatosCliente } from "../types/cliente";

interface FilaCliente extends RowDataPacket {
  id: number;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  usuario_id: number | null;
  activo: number;
  creado_en: string;
}

const COLUMNAS = "id, nombre, telefono, correo, usuario_id, activo, creado_en";

function convertirFila(fila: FilaCliente): Cliente {
  return {
    id: fila.id,
    nombre: fila.nombre,
    telefono: fila.telefono || "",
    correo: fila.correo || "",
    usuarioId: fila.usuario_id,
    activo: fila.activo === 1,
    creadoEn: fila.creado_en,
  };
}

// Solo los clientes activos, los más recientes primero.
export async function obtenerTodos(): Promise<Cliente[]> {
  const [filas] = await pool.query<FilaCliente[]>(
    "SELECT " + COLUMNAS + " FROM clientes WHERE activo = TRUE ORDER BY id DESC"
  );

  const clientes: Cliente[] = [];
  for (const fila of filas) {
    clientes.push(convertirFila(fila));
  }
  return clientes;
}

export async function obtenerPorId(id: number): Promise<Cliente | null> {
  const [filas] = await pool.query<FilaCliente[]>(
    "SELECT " + COLUMNAS + " FROM clientes WHERE id = ?",
    [id]
  );

  if (filas.length === 0) {
    return null;
  }
  return convertirFila(filas[0]);
}

// ¿Ya hay un cliente activo con ese correo? (sin importar mayúsculas)
export async function existeCorreo(correo: string): Promise<boolean> {
  if (correo === "") {
    return false;
  }
  const [filas] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM clientes WHERE activo = TRUE AND LOWER(correo) = LOWER(?)",
    [correo]
  );
  return filas[0].total > 0;
}

// ¿Ya hay un cliente activo con ese teléfono?
export async function existeTelefono(telefono: string): Promise<boolean> {
  if (telefono === "") {
    return false;
  }
  const [filas] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM clientes WHERE activo = TRUE AND telefono = ?",
    [telefono]
  );
  return filas[0].total > 0;
}

// El teléfono y el correo vacíos se guardan como NULL.
export async function crear(datos: DatosCliente): Promise<Cliente> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO clientes (nombre, telefono, correo) VALUES (?, ?, ?)",
    [datos.nombre, datos.telefono || null, datos.correo || null]
  );

  const creado = await obtenerPorId(resultado.insertId);
  if (!creado) {
    throw new Error("No se pudo leer el cliente recién creado.");
  }
  return creado;
}