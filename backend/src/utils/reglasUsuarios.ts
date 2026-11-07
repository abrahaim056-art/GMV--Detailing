function textoVacio(valor: unknown): boolean {
  return typeof valor !== "string" || valor.trim() === "";
}

export function validarRegistro(datos: any): string[] {
  const errores: string[] = [];

  if (textoVacio(datos.nombre)) {
    errores.push("Falta el nombre.");
  }
  if (textoVacio(datos.telefono)) {
    errores.push("Falta el teléfono.");
  }
  if (textoVacio(datos.correo) || !datos.correo.includes("@")) {
    errores.push("El correo no es válido.");
  }
  if (typeof datos.contrasena !== "string" || datos.contrasena.length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres.");
  }

  return errores;
}

export function validarInicioSesion(datos: any): string[] {
  const errores: string[] = [];

  if (textoVacio(datos.correo)) {
    errores.push("Escribe tu correo.");
  }
  if (textoVacio(datos.contrasena)) {
    errores.push("Escribe tu contraseña.");
  }

  return errores;
}
