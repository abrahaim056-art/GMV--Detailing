import { Cita } from "../types";
 
// Fecha de hoy (según el reloj de esta computadora), en formato AAAA-MM-DD.
function fechaDeHoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return ahora.getFullYear() + "-" + mes + "-" + dia;
}

export const HOY = fechaDeHoy();
export const HOY_TEXTO = new Date().toLocaleDateString("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const horarios: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
 
// Regla de negocio 1: un horario está ocupado si la cita sigue vigente.
// Las citas canceladas o no presentadas liberan su horario.
export function citaOcupaHorario(cita: Cita): boolean {
  if (cita.estado === "Cancelado") {
    return false;
  }
  if (cita.estado === "No se presentó") {
    return false;
  }
  return true;
}
 
// Convierte "2026-10-27" en "27 oct".
export function formatearFecha(fecha: string): string {
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const partes = fecha.split("-");
  return Number(partes[2]) + " " + meses[Number(partes[1]) - 1];
}