import { Router } from "express";
import {
  actualizarServicio,
  crearServicio,
  listarServicios,
  quitarServicio,
} from "../controllers/serviciosController";
import { requerirRol, requerirSesion } from "../middleware/autenticacion";

const router = Router();

// Ver el catálogo es público (lo usa la app móvil antes de iniciar sesión).
router.get("/", listarServicios);

// Administrar el catálogo es solo del encargado.
router.post("/", requerirSesion, requerirRol("encargado"), crearServicio);
router.put("/:id", requerirSesion, requerirRol("encargado"), actualizarServicio);
router.delete("/:id", requerirSesion, requerirRol("encargado"), quitarServicio);

export default router;
