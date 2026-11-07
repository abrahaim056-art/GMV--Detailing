import jwt from "jsonwebtoken";
import { DatosToken } from "../types/usuario";

function obtenerClave(): string {
  const clave = process.env.JWT_SECRET;
  if (!clave) {
    throw new Error("Falta JWT_SECRET en el archivo .env");
  }
  return clave;
}

// Crea el token que recibe el usuario al iniciar sesión (dura 7 días).
export function crearToken(datos: DatosToken): string {
  return jwt.sign({ id: datos.id, rol: datos.rol }, obtenerClave(), {
    expiresIn: 60 * 60 * 24 * 7,
  });
}

// Revisa un token. Devuelve sus datos, o null si no es válido o ya venció.
export function verificarToken(token: string): DatosToken | null {
  try {
    const contenido = jwt.verify(token, obtenerClave());

    if (typeof contenido === "string") {
      return null;
    }
    return { id: contenido.id, rol: contenido.rol };
  } catch (error) {
    return null;
  }
}
