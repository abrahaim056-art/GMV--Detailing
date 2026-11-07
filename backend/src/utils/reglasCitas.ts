import { EstadoCita, NuevaCita } from "../types/cita";

export const categoriasValidas: string[] = ["Auto compacto", "Sedán", "SUV", "Camioneta"];

export const estadosValidos: string[] = [
  "Agendado",
  "Recibido",
  "En proceso",
  "Terminado",
  "Entregado",
  "No se presentó",
  "Cancelado",
];

// Revisa los datos de una cita nueva y devuelve la lista de errores (vacía si todo está bien).
export function validarNuevaCita(datos: Partial<NuevaCita>): string[] {
  const errores: string[] = [];

  if (!datos.cliente || datos.cliente.trim() === "") {
    errores.push("Falta el nombre del cliente.");
  }

  // Regla 4: se necesita teléfono o correo.
  const sinTelefono = !datos.telefono || datos.telefono.trim() === "";
  const sinCorreo = !datos.correo || datos.correo.trim() === "";
  if (sinTelefono && sinCorreo) {
    errores.push("Se necesita un teléfono o un correo de contacto.");
  }

  if (!datos.vehiculo || datos.vehiculo.trim() === "") {
    errores.push("Falta el vehículo.");
  }

  // Regla 2: categoría y al menos un servicio.
  if (!datos.categoria || !categoriasValidas.includes(datos.categoria)) {
    errores.push("La categoría del vehículo no es válida.");
  }
  if (!Array.isArray(datos.serviciosIds) || datos.serviciosIds.length === 0) {
    errores.push("Se necesita al menos un servicio.");
  }

  if (!datos.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
    errores.push("La fecha debe tener el formato AAAA-MM-DD.");
  }
  if (!datos.hora || !/^\d{2}:\d{2}$/.test(datos.hora)) {
    errores.push("La hora debe tener el formato HH:MM.");
  }

  return errores;
}

// Regla 3: estados a los que se puede pasar desde el estado actual.
export function obtenerEstadosPermitidos(actual: EstadoCita): EstadoCita[] {
  switch (actual) {
    case "Agendado":
      return ["Recibido", "No se presentó", "Cancelado"];
    case "Recibido":
      return ["En proceso"];
    case "En proceso":
      return ["Terminado"];
    case "Terminado":
      return ["Entregado"];
    default:
      return [];
  }
}

// Revisa los datos que manda un cliente al agendar desde la app móvil.
// El nombre, teléfono y categoría salen de su cuenta y de su vehículo.
export function validarCitaCliente(datos: any): string[] {
  const errores: string[] = [];

  if (!datos.vehiculoId || Number(datos.vehiculoId) <= 0) {
    errores.push("Elige uno de tus vehículos.");
  }
  if (!Array.isArray(datos.serviciosIds) || datos.serviciosIds.length === 0) {
    errores.push("Se necesita al menos un servicio.");
  }
  if (!datos.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
    errores.push("La fecha debe tener el formato AAAA-MM-DD.");
  }
  if (!datos.hora || !/^\d{2}:\d{2}$/.test(datos.hora)) {
    errores.push("La hora debe tener el formato HH:MM.");
  }

  return errores;
}
