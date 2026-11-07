import { Router } from "express";
import {
  listarNotificaciones,
  marcarNotificacionLeida,
} from "../controllers/notificacionesController";
import { requerirSesion } from "../middleware/autenticacion";

const router = Router();

router.use(requerirSesion);

router.get("/", listarNotificaciones);
router.patch("/:id/leer", marcarNotificacionLeida);

export default router;
