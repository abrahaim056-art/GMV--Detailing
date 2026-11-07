import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Notificacion } from "../types/usuario";

interface FilaNotificacion extends RowDataPacket {
  id: number;
  cita_id: number | null;
  mensaje: string;
  leida: number;
  creada_en: string;
}

export async function crear(usuarioId: number, citaId: number, mensaje: string): Promise<void> {
  await pool.query(
    "INSERT INTO notificaciones (usuario_id, cita_id, mensaje) VALUES (?, ?, ?)",
    [usuarioId, citaId, mensaje]
  );
}

export async function obtenerPorUsuario(usuarioId: number): Promise<Notificacion[]> {
  const [filas] = await pool.query<FilaNotificacion[]>(
    "SELECT id, cita_id, mensaje, leida, creada_en FROM notificaciones WHERE usuario_id = ? ORDER BY id DESC",
    [usuarioId]
  );

  const notificaciones: Notificacion[] = [];
  for (const fila of filas) {
    notificaciones.push({
      id: fila.id,
      citaId: fila.cita_id,
      mensaje: fila.mensaje,
      leida: fila.leida === 1,
      creadaEn: fila.creada_en,
    });
  }
  return notificaciones;
}

// Devuelve false si la notificación no existe o no es de ese usuario.
export async function marcarLeida(id: number, usuarioId: number): Promise<boolean> {
  const [resultado] = await pool.query<ResultSetHeader>(
    "UPDATE notificaciones SET leida = TRUE WHERE id = ? AND usuario_id = ?",
    [id, usuarioId]
  );
  return resultado.affectedRows > 0;
}
