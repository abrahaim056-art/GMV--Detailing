import { Cita, EstadoCita } from "../types";
import { pedir } from "./apiBase";

export type DatosNuevaCita = Omit<Cita, "id" | "estado">;

export function obtenerCitas(): Promise<Cita[]> {
  return pedir<Cita[]>("/citas");
}

export function obtenerCita(id: number): Promise<Cita> {
  return pedir<Cita>("/citas/" + id);
}

// Para el panel web: el encargado registra una cita de alguien sin cuenta.
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
