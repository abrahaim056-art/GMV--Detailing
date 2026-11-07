import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Servicio } from "../types/cita";

interface FilaServicio extends RowDataPacket {
  id: string;
  nombre: string;
  precio: string;
  minutos: number;
}

export async function obtenerTodos(): Promise<Servicio[]> {
  const [filas] = await pool.query<FilaServicio[]>(
    "SELECT id, nombre, precio, minutos FROM servicios ORDER BY nombre"
  );

  const servicios: Servicio[] = [];
  for (const fila of filas) {
    servicios.push({
      id: fila.id,
      nombre: fila.nombre,
      precio: Number(fila.precio),
      minutos: fila.minutos,
    });
  }
  return servicios;
}
