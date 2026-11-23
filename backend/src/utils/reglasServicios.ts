import { DatosServicio, TipoServicio } from "../types/cita";

export const tiposValidos: string[] = ["paquete", "extra"];

// Revisa los datos de un servicio y devuelve la lista de errores (vacía si todo está bien).
export function validarServicio(datos: any): string[] {
  const errores: string[] = [];
  const cuerpo = datos || {};

  if (typeof cuerpo.nombre !== "string" || cuerpo.nombre.trim() === "") {
    errores.push("Falta el nombre del servicio.");
  } else if (cuerpo.nombre.trim().length > 100) {
    errores.push("El nombre no puede pasar de 100 caracteres.");
  }

  const precio = Number(cuerpo.precio);
  if (cuerpo.precio === undefined || cuerpo.precio === null || cuerpo.precio === "" || !isFinite(precio) || precio <= 0) {
    errores.push("El precio debe ser un número mayor a 0.");
  } else if (precio > 99999999) {
    errores.push("El precio es demasiado grande.");
  }

  const minutos = Number(cuerpo.minutos);
  if (cuerpo.minutos === undefined || cuerpo.minutos === null || cuerpo.minutos === "" || !Number.isInteger(minutos) || minutos <= 0) {
    errores.push("El tiempo debe ser un número entero de minutos mayor a 0.");
  } else if (minutos > 1440) {
    errores.push("El tiempo no puede pasar de 1440 minutos (24 horas).");
  }

  if (cuerpo.tipo !== undefined && !tiposValidos.includes(cuerpo.tipo)) {
    errores.push('El tipo debe ser "paquete" o "extra".');
  }

  if (cuerpo.descripcion !== undefined && cuerpo.descripcion !== null) {
    if (typeof cuerpo.descripcion !== "string") {
      errores.push("La descripción debe ser texto.");
    } else if (cuerpo.descripcion.length > 255) {
      errores.push("La descripción no puede pasar de 255 caracteres.");
    }
  }

  return errores;
}

// Convierte el cuerpo (ya validado) en los datos que se guardan.
export function limpiarServicio(datos: any): DatosServicio {
  let tipo: TipoServicio = "extra";
  if (datos.tipo === "paquete") {
    tipo = "paquete";
  }

  return {
    nombre: datos.nombre.trim(),
    descripcion: typeof datos.descripcion === "string" ? datos.descripcion.trim() : "",
    precio: Number(datos.precio),
    minutos: Number(datos.minutos),
    tipo: tipo,
  };
}
