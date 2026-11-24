import { Router } from "express";
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
} from "../controllers/clientesController";
import { requerirRol, requerirSesion } from "../middleware/autenticacion";

const router = Router();

// El directorio de clientes es solo del encargado.
router.use(requerirSesion);
router.use(requerirRol("encargado"));

router.get("/", listarClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;