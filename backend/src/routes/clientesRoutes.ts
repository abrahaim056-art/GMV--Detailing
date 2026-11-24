import { Router } from "express";
import { crearCliente, listarClientes } from "../controllers/clientesController";
import { requerirRol, requerirSesion } from "../middleware/autenticacion";

const router = Router();

// El directorio de clientes es solo del encargado.
router.use(requerirSesion);
router.use(requerirRol("encargado"));

router.get("/", listarClientes);
router.post("/", crearCliente);

export default router;