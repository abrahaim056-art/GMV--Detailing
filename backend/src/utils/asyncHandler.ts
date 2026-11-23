import { NextFunction, Request, RequestHandler, Response } from "express";

// Envuelve un controlador async: si la promesa falla, el error se manda a next()
// y llega a manejadorErrores, igual que con un try/catch.
// El tipo genérico permite que un controlador use PeticionAutenticada en vez de Request.
export function asyncHandler<T extends Request = Request>(
  controlador: (req: T, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    controlador(req as T, res, next).catch(next);
  };
}