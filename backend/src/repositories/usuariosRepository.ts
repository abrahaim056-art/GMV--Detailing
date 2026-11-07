import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Rol, Usuario, UsuarioConClave } from "../types/usuario";

interface FilaUsuario extends RowDataPacket {
  id: number;
  nombre: string;
  telefono: string | null;
  correo: string;
  contrasena_hash: string;
  rol: Rol;
}

function convertirFila(fila: FilaUsuario): UsuarioConClave {
  return {
    id: fila.id,
    nombre: fila.nombre,
    telefono: fila.telefono || "",
    correo: fila.correo,
    rol: fila.rol,
    contrasenaHash: fila.contrasena_hash,
  };
}

export async function buscarPorCorreo(correo: string): Promise<UsuarioConClave | null> {
  const [filas] = await pool.query<FilaUsuario[]>(
    "SELECT id, nombre, telefono, correo, contrasena_hash, rol FROM usuarios WHERE correo = ?",
    [correo]
  );

  if (filas.length === 0) {
    return null;
  }
  return convertirFila(filas[0]);
}

// Devuelve el usuario sin la contraseña.
export async function buscarPorId(id: number): Promise<Usuario | null> {
  const [filas] = await pool.query<FilaUsuario[]>(
    "SELECT id, nombre, telefono, correo, contrasena_hash, rol FROM usuarios WHERE id = ?",
    [id]
  );

  if (filas.length === 0) {
    return null;
  }

  const completo = convertirFila(filas[0]);
  return {
    id: completo.id,
    nombre: completo.nombre,
    telefono: completo.telefono,
    correo: completo.correo,
    rol: completo.rol,
  };
}

export async function crear(datos: {
  nombre: string;
  telefono: string;
  correo: string;
  contrasenaHash: string;
  rol: Rol;
}): Promise<number> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO usuarios (nombre, telefono, correo, contrasena_hash, rol) VALUES (?, ?, ?, ?, ?)",
    [datos.nombre, datos.telefono, datos.correo, datos.contrasenaHash, datos.rol]
  );
  return resultado.insertId;
}
