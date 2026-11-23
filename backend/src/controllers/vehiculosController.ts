import { PeticionAutenticada } from "../middleware/autenticacion";
import * as vehiculosRepository from "../repositories/vehiculosRepository";
import { asyncHandler } from "../utils/asyncHandler";
import { categoriasValidas } from "../utils/reglasCitas";

export const listarMisVehiculos = asyncHandler<PeticionAutenticada>(async (req, res) => {
  if (!req.usuario) {
    res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
    return;
  }

  const vehiculos = await vehiculosRepository.obtenerPorUsuario(req.usuario.id);
  res.json(vehiculos);
});

export const crearVehiculo = asyncHandler<PeticionAutenticada>(async (req, res) => {
  if (!req.usuario) {
    res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
    return;
  }

  const descripcion = req.body.descripcion;
  const categoria = req.body.categoria;

  if (typeof descripcion !== "string" || descripcion.trim() === "") {
    res.status(400).json({ mensaje: "Escribe la marca, modelo y año del vehículo." });
    return;
  }
  if (!categoriasValidas.includes(categoria)) {
    res.status(400).json({ mensaje: "La categoría del vehículo no es válida." });
    return;
  }

  const idNuevo = await vehiculosRepository.crear(req.usuario.id, descripcion.trim(), categoria);
  const vehiculo = await vehiculosRepository.obtenerPorId(idNuevo);
  res.status(201).json(vehiculo);
});