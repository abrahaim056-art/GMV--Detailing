import { Cita, CategoriaVehiculo } from "../types";

// Los servicios ya no viven aquí: vienen de la base de datos (GET /api/servicios).

// Catálogo de vehículos (marcas que se atienden).
export const marcas: CategoriaVehiculo[] = [
  "KIA",
  "Ford",
  "Chevrolet",
  "Subaru",
  "Mazda",
  "Volkswagen",
  "Honda",
  "Toyota",
  "Hyundai",
  "Tesla",
];

// Nombres de los servicios de una cita, separados por coma.
export function nombresDeCita(cita: Cita): string {
  const nombres: string[] = [];
  for (const servicio of cita.servicios) {
    nombres.push(servicio.nombre);
  }
  return nombres.join(", ");
}

// Suma el precio y los minutos de una lista de servicios.
export function sumarServicios(lista: { precio: number; minutos: number }[]): {
  precio: number;
  minutos: number;
} {
  let precio = 0;
  let minutos = 0;
  for (const servicio of lista) {
    precio = precio + servicio.precio;
    minutos = minutos + servicio.minutos;
  }
  return { precio: precio, minutos: minutos };
}
