import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Cita, DatosCitaNueva, EstadoCita, ServicioDeCita } from "../types/cita";

interface FilaCita extends RowDataPacket {
  id: number;
  usuario_id: number | null;
  cliente: string;
  telefono: string | null;
  correo: string | null;
  vehiculo: string;
  categoria: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  servicios_ids: string | null;
}

const CONSULTA_BASE = `
  SELECT c.id, c.usuario_id, c.cliente, c.telefono, c.correo, c.vehiculo, c.categoria,
         c.fecha, c.hora, c.estado,
         GROUP_CONCAT(cs.servicio_id) AS servicios_ids
  FROM citas c
  LEFT JOIN cita_servicios cs ON cs.cita_id = c.id
`;

// Convierte una fila de la base de datos en el objeto que usa el frontend.
function convertirFila(fila: FilaCita): Cita {
  let serviciosIds: string[] = [];
  if (fila.servicios_ids) {
    serviciosIds = fila.servicios_ids.split(",");
  }

  return {
    id: fila.id,
    usuarioId: fila.usuario_id,
    cliente: fila.cliente,
    telefono: fila.telefono || "",
    correo: fila.correo || "",
    vehiculo: fila.vehiculo,
    categoria: fila.categoria,
    serviciosIds: serviciosIds,
    servicios: [],
    total: 0,
    minutos: 0,
    fecha: fila.fecha,
    hora: fila.hora.slice(0, 5), // "09:00:00" -> "09:00"
    estado: fila.estado,
  };
}

interface FilaServicioDeCita extends RowDataPacket {
  cita_id: number;
  servicio_id: string;
  nombre: string;
  minutos: number;
  precio_aplicado: string;
}

// Agrega a cada cita el detalle de sus servicios (nombre, precio cobrado y tiempo)
// y los totales. Se hace con una sola consulta para todas las citas.
async function agregarDetalle(citas: Cita[]): Promise<void> {
  if (citas.length === 0) {
    return;
  }

  const ids: number[] = [];
  for (const cita of citas) {
    ids.push(cita.id);
  }

  const [filas] = await pool.query<FilaServicioDeCita[]>(
    "SELECT cs.cita_id, cs.servicio_id, s.nombre, s.minutos, cs.precio_aplicado " +
      "FROM cita_servicios cs JOIN servicios s ON s.id = cs.servicio_id " +
      "WHERE cs.cita_id IN (?) ORDER BY s.tipo = 'extra', cs.precio_aplicado DESC, s.nombre",
    [ids]
  );

  for (const cita of citas) {
    const lista: ServicioDeCita[] = [];
    let total = 0;
    let minutos = 0;

    for (const fila of filas) {
      if (fila.cita_id === cita.id) {
        const precio = Number(fila.precio_aplicado);
        lista.push({ id: fila.servicio_id, nombre: fila.nombre, precio: precio, minutos: fila.minutos });
        total = total + precio;
        minutos = minutos + fila.minutos;
      }
    }

    cita.servicios = lista;
    cita.total = total;
    cita.minutos = minutos;
  }
}

export async function obtenerTodas(filtros: {
  fecha?: string;
  estado?: string;
  usuarioId?: number;
}): Promise<Cita[]> {
  const condiciones: string[] = [];
  const valores: (string | number)[] = [];

  if (filtros.fecha) {
    condiciones.push("c.fecha = ?");
    valores.push(filtros.fecha);
  }
  if (filtros.estado) {
    condiciones.push("c.estado = ?");
    valores.push(filtros.estado);
  }
  if (filtros.usuarioId) {
    condiciones.push("c.usuario_id = ?");
    valores.push(filtros.usuarioId);
  }

  let consulta = CONSULTA_BASE;
  if (condiciones.length > 0) {
    consulta = consulta + " WHERE " + condiciones.join(" AND ");
  }
  consulta = consulta + " GROUP BY c.id ORDER BY c.fecha, c.hora";

  const [filas] = await pool.query<FilaCita[]>(consulta, valores);

  const citas: Cita[] = [];
  for (const fila of filas) {
    citas.push(convertirFila(fila));
  }
  await agregarDetalle(citas);
  return citas;
}

export async function obtenerPorId(id: number): Promise<Cita | null> {
  const [filas] = await pool.query<FilaCita[]>(
    CONSULTA_BASE + " WHERE c.id = ? GROUP BY c.id",
    [id]
  );

  if (filas.length === 0) {
    return null;
  }
  const cita = convertirFila(filas[0]);
  await agregarDetalle([cita]);
  return cita;
}

// Regla 1: un horario está ocupado si hay una cita vigente en esa fecha y hora.
export async function existeCitaEnHorario(fecha: string, hora: string): Promise<boolean> {
  const [filas] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM citas WHERE fecha = ? AND hora = ? AND estado NOT IN ('Cancelado', 'No se presentó')",
    [fecha, hora]
  );
  return filas[0].total > 0;
}

// Guarda la cita, sus servicios y el primer registro del historial.
export async function crear(datos: DatosCitaNueva, creadoPor: number): Promise<number> {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.query<ResultSetHeader>(
      "INSERT INTO citas (usuario_id, cliente, telefono, correo, vehiculo_id, vehiculo, categoria, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Agendado')",
      [
        datos.usuarioId,
        datos.cliente,
        datos.telefono,
        datos.correo,
        datos.vehiculoId,
        datos.vehiculo,
        datos.categoria,
        datos.fecha,
        datos.hora,
      ]
    );

    const idNuevo = resultado.insertId;

    // Se guarda el precio que tiene el servicio hoy.
    for (const idServicio of datos.serviciosIds) {
      await conexion.query(
        "INSERT INTO cita_servicios (cita_id, servicio_id, precio_aplicado) SELECT ?, id, precio FROM servicios WHERE id = ?",
        [idNuevo, idServicio]
      );
    }

    await conexion.query(
      "INSERT INTO historial_estados (cita_id, estado, cambiado_por) VALUES (?, 'Agendado', ?)",
      [idNuevo, creadoPor]
    );

    await conexion.commit();
    return idNuevo;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

// Cambia el estado y lo anota en el historial.
export async function cambiarEstado(id: number, estado: EstadoCita, cambiadoPor: number): Promise<void> {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    await conexion.query("UPDATE citas SET estado = ? WHERE id = ?", [estado, id]);
    await conexion.query(
      "INSERT INTO historial_estados (cita_id, estado, cambiado_por) VALUES (?, ?, ?)",
      [id, estado, cambiadoPor]
    );

    await conexion.commit();
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}
