import "dotenv/config";
import app from "./app";

const PUERTO = Number(process.env.PORT || 3000);

app.listen(PUERTO, () => {
  console.log("API de GMV Detailing escuchando en http://localhost:" + PUERTO);
});
