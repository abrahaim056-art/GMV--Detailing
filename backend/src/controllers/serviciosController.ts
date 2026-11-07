import { NextFunction, Request, Response } from "express";
import * as serviciosRepository from "../repositories/serviciosRepository";

export async function listarServicios(req: Request, res: Response, next: NextFunction) {
  try {
    const servicios = await serviciosRepository.obtenerTodos();
    res.json(servicios);
  } catch (error) {
    next(error);
  }
}
