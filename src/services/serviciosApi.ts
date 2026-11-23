import { DatosServicio, Servicio } from "../types";
import { pedir } from "./apiBase";

// Catálogo de servicios activos (paquetes y servicios sueltos).
export function obtenerServicios(): Promise<Servicio[]> {
  return pedir<Servicio[]>("/servicios");
}

export function crearServicio(datos: DatosServicio): Promise<Servicio> {
  return pedir<Servicio>("/servicios", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function editarServicio(id: string, datos: DatosServicio): Promise<Servicio> {
  return pedir<Servicio>("/servicios/" + id, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

// "Quitar" desactiva el servicio: las citas anteriores lo conservan.
export function quitarServicio(id: string): Promise<{ mensaje: string }> {
  return pedir<{ mensaje: string }>("/servicios/" + id, { method: "DELETE" });
}
