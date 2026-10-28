import { Cita } from "../types";

// Fecha "de hoy" fija para que la demostración siempre se vea igual.
export const HOY = "2026-10-27";

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
    vehiculo: "Nissan Versa 2020",
    categoria: "Sedán",
    serviciosIds: ["lavado-completo"],
    fecha: HOY,
    hora: "09:00",
    estado: "Entregado",
  },
  {
    id: 2,
    cliente: "Mariana López",
    telefono: "998 222 3344",
    correo: "",
    vehiculo: "Honda CR-V 2022",
    categoria: "SUV",
    serviciosIds: ["detallado-interior", "encerado"],
    fecha: HOY,
    hora: "10:00",
    estado: "En proceso",
  },
  {
    id: 3,
    cliente: "Jorge Herrera",
    telefono: "",
    correo: "jorge@correo.com",
    vehiculo: "Toyota Hilux 2019",
    categoria: "Camioneta",
    serviciosIds: ["lavado-exterior"],
    fecha: HOY,
    hora: "11:00",
    estado: "Terminado",
  },
  {
    id: 4,
    cliente: "Ana Torres",
    telefono: "998 444 5566",
    correo: "ana@correo.com",
    vehiculo: "Chevrolet Aveo 2018",
    categoria: "Auto compacto",
    serviciosIds: ["lavado-completo", "encerado"],
    fecha: HOY,
    hora: "12:00",
    estado: "Agendado",
  },
  {
    id: 5,
    cliente: "Luis Medina",
    telefono: "998 555 6677",
    correo: "",
    vehiculo: "Mazda CX-5 2021",
    categoria: "SUV",
    serviciosIds: ["pulido"],
    fecha: HOY,
    hora: "13:00",
    estado: "No se presentó",
  },
  {
    id: 6,
    cliente: "Sofía Castillo",
    telefono: "998 666 7788",
    correo: "sofia@correo.com",
    vehiculo: "Kia Rio 2023",
    categoria: "Sedán",
    serviciosIds: ["lavado-exterior"],
    fecha: "2026-10-28",
    hora: "10:00",
    estado: "Agendado",
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
