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

// "paquete" = Básico, Premium, Ejecutivo. "extra" = servicio suelto que se suma
// a un paquete o se pide solo (aspirado, pintado, etc.).
export type TipoServicio = "paquete" | "extra";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  minutos: number;
  tipo: TipoServicio;
  activo: boolean;
}

// Lo que se manda a la API para crear o editar un servicio.
export interface DatosServicio {
  nombre: string;
  descripcion: string;
  precio: number;
  minutos: number;
  tipo: TipoServicio;
}

// Un servicio dentro de una cita, con el precio que se cobró ese día.
export interface ServicioDeCita {
  id: string;
  nombre: string;
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
  servicios: ServicioDeCita[];
  total: number; // suma de los precios cobrados
  minutos: number; // suma del tiempo aproximado
  fecha: string; // formato AAAA-MM-DD
  hora: string; // formato HH:MM
  estado: EstadoCita;
}
