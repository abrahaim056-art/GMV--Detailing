import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import citasRoutes from "./routes/citasRoutes";
import clientesRoutes from "./routes/clientesRoutes"; 
import notificacionesRoutes from "./routes/notificacionesRoutes";
import serviciosRoutes from "./routes/serviciosRoutes";
import vehiculosRoutes from "./routes/vehiculosRoutes";
import { manejadorErrores, rutaNoEncontrada } from "./middleware/manejadorErrores";

const app = express();

// CORS: si existe CORS_ORIGIN en el .env solo se aceptan esos orígenes (separados por coma).
// Si no existe, se acepta cualquiera (cómodo en desarrollo).
const origenes = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origen) => origen.trim())
  : true;
app.use(cors({ origin: origenes }));
app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ estado: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/clientes", clientesRoutes); 
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

export default app;