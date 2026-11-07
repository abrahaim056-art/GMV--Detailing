import "dotenv/config";
import { pool } from "../config/database";
import * as usuariosRepository from "../repositories/usuariosRepository";
import { cifrar } from "../utils/contrasenas";

// Crea la cuenta del dueño (rol encargado). Se usa una sola vez:
//   npm run crear-encargado -- "Nombre del dueño" correo@ejemplo.com contraseña
async function main() {
  const nombre = process.argv[2];
  const correo = process.argv[3];
  const contrasena = process.argv[4];

  if (!nombre || !correo || !contrasena) {
    console.log('Uso: npm run crear-encargado -- "Nombre" correo@ejemplo.com contraseña');
    process.exit(1);
  }

  const correoLimpio = correo.trim().toLowerCase();

  const existente = await usuariosRepository.buscarPorCorreo(correoLimpio);
  if (existente) {
    console.log("Ya existe una cuenta con ese correo.");
    await pool.end();
    return;
  }

  const contrasenaHash = await cifrar(contrasena);
  const id = await usuariosRepository.crear({
    nombre: nombre,
    telefono: "",
    correo: correoLimpio,
    contrasenaHash: contrasenaHash,
    rol: "encargado",
  });

  console.log("Encargado creado con id " + id);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
