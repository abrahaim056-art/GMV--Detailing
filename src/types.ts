// Estados por los que pasa una cita (tomados del diagrama del flujo).
export type EstadoCita =
  | "Agendado"
  | "Recibido"
  | "En proceso"
  | "Terminado"
  | "Entregado"
  | "No se presentó"
  | "Cancelado";

export type CategoriaVehiculo = "Auto compacto" | "Sedán" | "SUV" | "Camioneta";

export interface Servicio {
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
  vehiculo: string;
  categoria: CategoriaVehiculo;
  serviciosIds: string[];
  fecha: string; // formato AAAA-MM-DD
  hora: string; // formato HH:MM
  estado: EstadoCita;
}
