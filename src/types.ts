// Estados por los que pasa una cita (tomados del diagrama del flujo).
export type EstadoCita =
  | "Agendado"
  | "Recibido"
  | "En proceso"
  | "Terminado"
  | "Entregado"
  | "No se presentó"
  | "Cancelado";
 
// Catálogo de vehículos: la marca que se elige se guarda en el campo "categoria".
export type CategoriaVehiculo =
  | "KIA"
  | "Ford"
  | "Chevrolet"
  | "Subaru"
  | "Mazda"
  | "Volkswagen"
  | "Honda"
  | "Toyota"
  | "Hyundai"
  | "Tesla";
 
export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  minutos: number;
}
 
export interface Cita {
  id: number;
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string; // marca, modelo y año. Ejemplo: "Toyota Hilux 2019"
  categoria: CategoriaVehiculo;
  serviciosIds: string[];
  fecha: string; // formato AAAA-MM-DD
  hora: string; // formato HH:MM
  estado: EstadoCita;
}