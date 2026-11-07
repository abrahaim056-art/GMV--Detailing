import { Router } from "express";
import { iniciarSesion, obtenerPerfil, registrar } from "../controllers/authController";
import { requerirSesion } from "../middleware/autenticacion";

const router = Router();

router.post("/registro", registrar);
router.post("/iniciar-sesion", iniciarSesion);
router.get("/yo", requerirSesion, obtenerPerfil);

export default router;
