import { ServicioExtra } from "../types";

// Servicios extra / individuales que se pueden sumar a una cita.
// Se administran (agregar, editar, quitar) desde la página de servicios.
export const extrasIniciales: ServicioExtra[] = [
  { id: "extra-1", nombre: "Limpieza de motor", precio: 150, minutos: 30 },
  { id: "extra-2", nombre: "Aromatizante premium", precio: 60, minutos: 5 },
  { id: "extra-3", nombre: "Protección de llantas", precio: 90, minutos: 15 },
];

export function calcularTotalExtras(extras: ServicioExtra[]): number {
  let total = 0;
  for (const extra of extras) {
    total += extra.precio;
  }
  return total;
}

export function calcularMinutosExtras(extras: ServicioExtra[]): number {
  let total = 0;
  for (const extra of extras) {
    total += extra.minutos;
  }
  return total;
}