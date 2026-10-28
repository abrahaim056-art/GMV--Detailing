import { CategoriaVehiculo, Servicio } from "../types";

// Datos ficticios. Los precios y tiempos reales se definirán con el negocio.
export const servicios: Servicio[] = [
  { id: "lavado-exterior", nombre: "Lavado exterior", precio: 120, minutos: 30 },
  { id: "lavado-completo", nombre: "Lavado completo", precio: 220, minutos: 60 },
  { id: "detallado-interior", nombre: "Detallado interior", precio: 450, minutos: 90 },
  { id: "encerado", nombre: "Encerado", precio: 300, minutos: 45 },
  { id: "pulido", nombre: "Pulido de pintura", precio: 800, minutos: 120 },
];

export const categorias: CategoriaVehiculo[] = [
  "Auto compacto",
  "Sedán",
  "SUV",
  "Camioneta",
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
