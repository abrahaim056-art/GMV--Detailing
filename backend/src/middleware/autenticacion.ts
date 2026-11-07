import { NextFunction, Request, Response } from "express";
import { DatosToken, Rol } from "../types/usuario";
import { verificarToken } from "../utils/token";

// Una petición normal, más los datos de quien inició sesión.
export interface PeticionAutenticada extends Request {
  usuario?: DatosToken;
}

// Exige que la petición traiga un token válido.
export function requerirSesion(req: PeticionAutenticada, res: Response, next: NextFunction) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith("Bearer ")) {
    res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
    return;
  }

  const token = encabezado.slice(7);
  const datos = verificarToken(token);

  if (!datos) {
    res.status(401).json({ mensaje: "Tu sesión no es válida o ya venció." });
    return;
  }

  req.usuario = datos;
  next();
}

// Exige que quien inició sesión tenga un rol en particular.
export function requerirRol(rolPermitido: Rol) {
  return function (req: PeticionAutenticada, res: Response, next: NextFunction) {
    if (!req.usuario || req.usuario.rol !== rolPermitido) {
      res.status(403).json({ mensaje: "No tienes permiso para hacer esto." });
      return;
    }
    next();
  };
}
