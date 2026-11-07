import { Router } from "express";
import { crearVehiculo, listarMisVehiculos } from "../controllers/vehiculosController";
import { requerirRol, requerirSesion } from "../middleware/autenticacion";

const router = Router();

// Solo los clientes tienen vehículos propios.
router.use(requerirSesion);
router.use(requerirRol("cliente"));

router.get("/", listarMisVehiculos);
router.post("/", crearVehiculo);

export default router;
