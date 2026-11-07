import { Router } from "express";
import { listarServicios } from "../controllers/serviciosController";

const router = Router();

router.get("/", listarServicios);

export default router;
