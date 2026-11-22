import { ServicioExtra } from "../types";

// Servicios extra que aparecen al registrar una cita.
// Se pueden agregar y quitar desde la página "Servicios".
export const extrasIniciales: ServicioExtra[] = [
  { id: "extra-1", nombre: "Limpieza de motor", precio: 150 },
  { id: "extra-2", nombre: "Aromatizante premium", precio: 60 },
  { id: "extra-3", nombre: "Protección de llantas", precio: 90 },
];

export function calcularTotalExtras(extras: ServicioExtra[]): number {
  let total = 0;
  for (const extra of extras) {
    total += extra.precio;
  }
  return total;
}