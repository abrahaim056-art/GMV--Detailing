export type EstadoCita =
  | "Agendado"
  | "Recibido"
  | "En proceso"
  | "Terminado"
  | "Entregado"
  | "No se presentó"
  | "Cancelado";

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  minutos: number;
}

// Misma forma que usa el frontend (src/types.ts), más el dueño de la cita.
export interface Cita {
  id: number;
  usuarioId: number | null; // null si la registró el encargado para alguien sin cuenta
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string;
  categoria: string;
  serviciosIds: string[];
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  estado: EstadoCita;
}

// Datos que manda el encargado al registrar una cita de alguien sin cuenta.
export interface NuevaCita {
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string;
  categoria: string;
  serviciosIds: string[];
  fecha: string;
  hora: string;
}

// Datos completos que se guardan en la base de datos.
export interface DatosCitaNueva {
  usuarioId: number | null;
  cliente: string;
  telefono: string;
  correo: string;
  vehiculoId: number | null;
  vehiculo: string;
  categoria: string;
  serviciosIds: string[];
  fecha: string;
  hora: string;
}
