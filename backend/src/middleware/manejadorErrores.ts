import { NextFunction, Request, Response } from "express";

// Responde 404 cuando la ruta no existe.
export function rutaNoEncontrada(req: Request, res: Response) {
  res.status(404).json({ mensaje: "La ruta no existe." });
}

// Responde 500 cuando algo falla dentro del servidor.
export function manejadorErrores(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);
  res.status(500).json({ mensaje: "Error interno del servidor." });
}
