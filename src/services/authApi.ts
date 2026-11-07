import { guardarToken, pedir } from "./apiBase";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  rol: "cliente" | "encargado";
}

interface RespuestaSesion {
  token: string;
  usuario: UsuarioSesion;
}

export async function iniciarSesion(correo: string, contrasena: string): Promise<UsuarioSesion> {
  const respuesta = await pedir<RespuestaSesion>("/auth/iniciar-sesion", {
    method: "POST",
    body: JSON.stringify({ correo: correo, contrasena: contrasena }),
  });

  guardarToken(respuesta.token);
  return respuesta.usuario;
}

export function cerrarSesion() {
  guardarToken("");
}
