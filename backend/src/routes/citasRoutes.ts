import { Router } from "express";
import {
  cambiarEstadoCita,
  crearCita,
  listarCitas,
  obtenerCita,
} from "../controllers/citasController";
import { requerirSesion } from "../middleware/autenticacion";

const router = Router();

// Todas las rutas de citas necesitan sesión.
// Qué puede hacer cada rol se revisa dentro del controlador.
router.use(requerirSesion);

router.get("/", listarCitas);
router.get("/:id", obtenerCita);
router.post("/", crearCita);
router.patch("/:id/estado", cambiarEstadoCita);

export default router;
