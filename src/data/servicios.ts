import { CategoriaVehiculo, Servicio } from "../types";
 
// Datos ficticios. Los precios y tiempos reales se definirán con el negocio.
// Son los mismos tres tipos de servicio que usa la app móvil.
export const servicios: Servicio[] = [
  {
    id: "basico",
    nombre: "Servicio Básico",
    descripcion: "Lavado exterior, secado a mano y llantas",
    precio: 120,
    minutos: 30,
  },
  {
    id: "premium",
    nombre: "Servicio Premium",
    descripcion: "Lavado completo, aspirado, vidrios y aromatizante",
    precio: 220,
    minutos: 60,
  },
  {
    id: "ejecutivo",
    nombre: "Servicio Ejecutivo (Detallado)",
    descripcion: "Detallado interior, encerado y pulido de pintura",
    precio: 800,
    minutos: 120,
  },
];
 
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
 
// Recibe una lista de ids y devuelve los nombres separados por coma.
export function obtenerNombresServicios(ids: string[]): string {
  const nombres: string[] = [];
 
  for (const id of ids) {
    for (const servicio of servicios) {
      if (servicio.id === id) {
        nombres.push(servicio.nombre);
      }
    }
  }
 
  return nombres.join(", ");
}
 
// Suma los minutos y el precio de una lista de servicios.
export function calcularTotales(ids: string[]): { minutos: number; precio: number } {
  let minutos = 0;
  let precio = 0;
 
  for (const id of ids) {
    for (const servicio of servicios) {
      if (servicio.id === id) {
        minutos = minutos + servicio.minutos;
        precio = precio + servicio.precio;
      }
    }
  }
 
  return { minutos: minutos, precio: precio };
}