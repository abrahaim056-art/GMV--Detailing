import { Cita } from "../types";
 
// Fecha "de hoy" fija para que la demostración siempre se vea igual.
export const HOY = "2026-10-27";
export const HOY_TEXTO = "27 de octubre de 2026";
 
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
 
export const citasIniciales: Cita[] = [
  {
    id: 1,
    cliente: "Carlos Ramírez",
    telefono: "998 111 2233",
    correo: "carlos@correo.com",
    vehiculo: "Toyota Hilux 2019",
    categoria: "Toyota",
    serviciosIds: ["premium"],
    fecha: HOY,
    hora: "09:00",
    estado: "Agendado",
  },
  {
    id: 2,
    cliente: "Mariana López",
    telefono: "998 222 3344",
    correo: "",
    vehiculo: "Honda CR-V 2022",
    categoria: "Honda",
    serviciosIds: ["ejecutivo"],
    fecha: HOY,
    hora: "10:00",
    estado: "En proceso",
  },
  {
    id: 3,
    cliente: "Jorge Herrera",
    telefono: "998 333 4455",
    correo: "jorge@correo.com",
    vehiculo: "Ford Ranger 2020",
    categoria: "Ford",
    serviciosIds: ["basico"],
    fecha: HOY,
    hora: "11:30",
    estado: "Recibido",
  },
  {
    id: 4,
    cliente: "Ana Torres",
    telefono: "998 444 5566",
    correo: "ana@correo.com",
    vehiculo: "Chevrolet Onix 2022",
    categoria: "Chevrolet",
    serviciosIds: ["basico"],
    fecha: HOY,
    hora: "13:00",
    estado: "Agendado",
  },
  {
    id: 5,
    cliente: "Luis Medina",
    telefono: "998 555 6677",
    correo: "",
    vehiculo: "Mazda CX-5 2021",
    categoria: "Mazda",
    serviciosIds: ["premium"],
    fecha: HOY,
    hora: "14:30",
    estado: "No se presentó",
  },
  {
    id: 6,
    cliente: "Pedro Sánchez",
    telefono: "998 666 7788",
    correo: "pedro@correo.com",
    vehiculo: "Volkswagen Golf 2021",
    categoria: "Volkswagen",
    serviciosIds: ["premium"],
    fecha: HOY,
    hora: "16:00",
    estado: "Terminado",
  },
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