import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import citasRoutes from "./routes/citasRoutes";
import notificacionesRoutes from "./routes/notificacionesRoutes";
import serviciosRoutes from "./routes/serviciosRoutes";
import vehiculosRoutes from "./routes/vehiculosRoutes";
import { manejadorErrores, rutaNoEncontrada } from "./middleware/manejadorErrores";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ estado: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;
