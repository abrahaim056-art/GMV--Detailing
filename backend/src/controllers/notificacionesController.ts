import { NextFunction, Response } from "express";
import { PeticionAutenticada } from "../middleware/autenticacion";
import * as notificacionesRepository from "../repositories/notificacionesRepository";

export async function listarNotificaciones(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    if (!req.usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const notificaciones = await notificacionesRepository.obtenerPorUsuario(req.usuario.id);
    res.json(notificaciones);
  } catch (error) {
    next(error);
  }
}

export async function marcarNotificacionLeida(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    if (!req.usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const id = Number(req.params.id);
    const encontrada = await notificacionesRepository.marcarLeida(id, req.usuario.id);

    if (!encontrada) {
      res.status(404).json({ mensaje: "No encontramos esa notificación." });
      return;
    }
    res.json({ mensaje: "Notificación marcada como leída." });
  } catch (error) {
    next(error);
  }
}
