import { PeticionAutenticada } from "../middleware/autenticacion";
import * as notificacionesRepository from "../repositories/notificacionesRepository";
import { asyncHandler } from "../utils/asyncHandler";

export const listarNotificaciones = asyncHandler<PeticionAutenticada>(async (req, res) => {
  if (!req.usuario) {
    res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
    return;
  }

  const notificaciones = await notificacionesRepository.obtenerPorUsuario(req.usuario.id);
  res.json(notificaciones);
});

export const marcarNotificacionLeida = asyncHandler<PeticionAutenticada>(async (req, res) => {
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
});