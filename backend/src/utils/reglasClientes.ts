import { DatosCliente } from "../types/cliente";

function textoVacio(valor: unknown): boolean {
  return typeof valor !== "string" || valor.trim() === "";
}

// Revisa los datos de un cliente y devuelve la lista de errores (vacía si todo está bien).
export function validarCliente(datos: any): string[] {
  const errores: string[] = [];
  const cuerpo = datos || {};

  if (textoVacio(cuerpo.nombre)) {
    errores.push("Falta el nombre del cliente.");
  } else if (cuerpo.nombre.trim().length > 100) {
    errores.push("El nombre no puede pasar de 100 caracteres.");
  }

  const sinTelefono = textoVacio(cuerpo.telefono);
  const sinCorreo = textoVacio(cuerpo.correo);

  // Misma regla 4 de las citas: se necesita teléfono o correo para contactarlo.
  if (sinTelefono && sinCorreo) {
    errores.push("Se necesita un teléfono o un correo de contacto.");
  }

  if (!sinTelefono) {
    if (cuerpo.telefono.trim().length > 30) {
      errores.push("El teléfono no puede pasar de 30 caracteres.");
    } else if (!/^[0-9+()\-\s]{7,}$/.test(cuerpo.telefono.trim())) {
      errores.push("El teléfono solo puede llevar números, espacios, + - y paréntesis.");
    }
  }

  if (!sinCorreo) {
    if (cuerpo.correo.trim().length > 100) {
      errores.push("El correo no puede pasar de 100 caracteres.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cuerpo.correo.trim())) {
      errores.push("El correo no es válido.");
    }
  }

  return errores;
}

// Convierte el cuerpo (ya validado) en los datos que se guardan.
export function limpiarCliente(datos: any): DatosCliente {
  return {
    nombre: datos.nombre.trim(),
    telefono: typeof datos.telefono === "string" ? datos.telefono.trim() : "",
    correo: typeof datos.correo === "string" ? datos.correo.trim() : "",
  };
}