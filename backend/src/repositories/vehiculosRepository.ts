import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Vehiculo } from "../types/usuario";

interface FilaVehiculo extends RowDataPacket {
  id: number;
  usuario_id: number;
  descripcion: string;
  categoria: string;
}

function convertirFila(fila: FilaVehiculo): Vehiculo {
  return {
    id: fila.id,
    usuarioId: fila.usuario_id,
    descripcion: fila.descripcion,
    categoria: fila.categoria,
  };
}

export async function obtenerPorUsuario(usuarioId: number): Promise<Vehiculo[]> {
  const [filas] = await pool.query<FilaVehiculo[]>(
    "SELECT id, usuario_id, descripcion, categoria FROM vehiculos WHERE usuario_id = ? ORDER BY id",
    [usuarioId]
  );

  const vehiculos: Vehiculo[] = [];
  for (const fila of filas) {
    vehiculos.push(convertirFila(fila));
  }
  return vehiculos;
}

export async function obtenerPorId(id: number): Promise<Vehiculo | null> {
  const [filas] = await pool.query<FilaVehiculo[]>(
    "SELECT id, usuario_id, descripcion, categoria FROM vehiculos WHERE id = ?",
    [id]
  );

  if (filas.length === 0) {
    return null;
  }
  return convertirFila(filas[0]);
}

export async function crear(usuarioId: number, descripcion: string, categoria: string): Promise<number> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "INSERT INTO vehiculos (usuario_id, descripcion, categoria) VALUES (?, ?, ?)",
    [usuarioId, descripcion, categoria]
  );
  return resultado.insertId;
}
