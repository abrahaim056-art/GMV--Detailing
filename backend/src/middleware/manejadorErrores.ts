import { NextFunction, Request, Response } from "express";
import { ErrorHttp } from "../utils/errores";

// Responde 404 cuando la ruta no existe.
export function rutaNoEncontrada(req: Request, res: Response) {
  res.status(404).json({ mensaje: "La ruta no existe." });
}

// Convierte cualquier error en una respuesta JSON.
//  - ErrorHttp: usa su código (400, 404, 409...) y su mensaje.
//  - JSON mal escrito en el cuerpo de la petición: 400.
//  - Cualquier otro fallo: 500 sin mostrar detalles internos.
export function manejadorErrores(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ErrorHttp) {
    res.status(error.codigo).json({ mensaje: error.message });
    return;
  }

  if ((error as Error & { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ mensaje: "El cuerpo de la petición no es un JSON válido." });
    return;
  }

  console.error(error);
  res.status(500).json({ mensaje: "Error interno del servidor." });
}
