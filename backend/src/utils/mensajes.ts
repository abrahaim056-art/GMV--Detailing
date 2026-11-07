import { EstadoCita } from "../types/cita";

// Texto de la notificación que recibe el cliente en cada cambio de estado.
export function obtenerMensajeEstado(estado: EstadoCita): string {
  switch (estado) {
    case "Recibido":
      return "Recibimos tu vehículo.";
    case "En proceso":
      return "Ya empezamos a lavar tu vehículo.";
    case "Terminado":
      return "Tu vehículo está listo. Puedes pasar por él.";
    case "Entregado":
      return "Gracias por tu visita.";
    case "Cancelado":
      return "Tu cita fue cancelada.";
    case "No se presentó":
      return "Tu cita se marcó como no presentada.";
    default:
      return "Tu cita cambió de estado.";
  }
}
