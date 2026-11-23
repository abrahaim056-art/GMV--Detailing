import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { DatosServicio, Servicio, TipoServicio } from "../types/cita";

interface FilaServicio extends RowDataPacket {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string; // MySQL devuelve DECIMAL como texto
  minutos: number;
  tipo: TipoServicio;
  activo: number;
}

const COLUMNAS = "id, nombre, descripcion, precio, minutos, tipo, activo";

function convertirFila(fila: FilaServicio): Servicio {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: Number(fila.precio),
    minutos: fila.minutos,
    tipo: fila.tipo,
    activo: fila.activo === 1,
  };
}

// Solo los servicios activos: primero los paquetes y luego los sueltos.
export async function obtenerTodos(): Promise<Servicio[]> {
  const [filas] = await pool.query<FilaServicio[]>(
    "SELECT " + COLUMNAS + " FROM servicios WHERE activo = TRUE ORDER BY tipo = 'extra', precio, nombre"
  );

  const servicios: Servicio[] = [];
  for (const fila of filas) {
    servicios.push(convertirFila(fila));
  }
  return servicios;
}

// Devuelve el servicio aunque esté desactivado (el controlador decide qué hacer).
export async function obtenerPorId(id: string): Promise<Servicio | null> {
  const [filas] = await pool.query<FilaServicio[]>(
    "SELECT " + COLUMNAS + " FROM servicios WHERE id = ?",
    [id]
  );

  if (filas.length === 0) {
    return null;
  }
  return convertirFila(filas[0]);
}

// ¿Ya hay un servicio activo con ese nombre? (sin importar mayúsculas)
export async function existeNombre(nombre: string, idIgnorar?: string): Promise<boolean> {
  const [filas] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM servicios WHERE activo = TRUE AND LOWER(nombre) = LOWER(?) AND id <> ?",
    [nombre, idIgnorar || ""]
  );
  return filas[0].total > 0;
}

// Convierte "Limpieza de motor" en "limpieza-de-motor".
function crearTexto(nombre: string): string {
  const texto = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  if (texto === "") {
    return "servicio";
  }
  return texto;
}

// Genera un id legible que no esté repetido (aunque el servicio viejo esté desactivado).
async function generarId(nombre: string): Promise<string> {
  const base = crearTexto(nombre);
  let candidato = base;
  let numero = 2;

  while ((await obtenerPorId(candidato)) !== null) {
    candidato = base + "-" + numero;
    numero = numero + 1;
  }
  return candidato;
}

export async function crear(datos: DatosServicio): Promise<Servicio> {
  const id = await generarId(datos.nombre);

  await pool.query<ResultSetHeader>(
    "INSERT INTO servicios (id, nombre, descripcion, precio, minutos, tipo) VALUES (?, ?, ?, ?, ?, ?)",
    [id, datos.nombre, datos.descripcion, datos.precio, datos.minutos, datos.tipo]
  );

  const creado = await obtenerPorId(id);
  if (!creado) {
    throw new Error("No se pudo leer el servicio recién creado.");
  }
  return creado;
}

export async function actualizar(id: string, datos: DatosServicio): Promise<Servicio> {
  await pool.query<ResultSetHeader>(
    "UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, minutos = ?, tipo = ? WHERE id = ?",
    [datos.nombre, datos.descripcion, datos.precio, datos.minutos, datos.tipo, id]
  );

  const actualizado = await obtenerPorId(id);
  if (!actualizado) {
    throw new Error("No se pudo leer el servicio actualizado.");
  }
  return actualizado;
}

// "Quitar" un servicio: se desactiva en vez de borrarse, porque las citas
// anteriores lo siguen usando (tabla cita_servicios).
export async function desactivar(id: string): Promise<void> {
  await pool.query("UPDATE servicios SET activo = FALSE WHERE id = ?", [id]);
}
