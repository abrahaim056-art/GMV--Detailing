import { Cita, EstadoCita } from "../types";
import { pedir } from "./apiBase";

// Datos que manda el panel web al registrar una cita de alguien sin cuenta.
export interface DatosNuevaCita {
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string;
  categoria: string;
  serviciosIds: string[]; // el paquete (si hay) y los servicios sueltos
  fecha: string;
  hora: string;
}

export function obtenerCitas(): Promise<Cita[]> {
  return pedir<Cita[]>("/citas");
}

export function obtenerCita(id: number): Promise<Cita> {
  return pedir<Cita>("/citas/" + id);
}

export function crearCita(datos: DatosNuevaCita): Promise<Cita> {
  return pedir<Cita>("/citas", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function cambiarEstadoCita(id: number, estado: EstadoCita): Promise<Cita> {
  return pedir<Cita>("/citas/" + id + "/estado", {
    method: "PATCH",
    body: JSON.stringify({ estado: estado }),
  });
}
