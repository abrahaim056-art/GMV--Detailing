import * as serviciosRepository from "../repositories/serviciosRepository";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorHttp } from "../utils/errores";
import { limpiarServicio, validarServicio } from "../utils/reglasServicios";

// GET /api/servicios (público: lo usa también la app móvil)
export const listarServicios = asyncHandler(async (req, res) => {
  const servicios = await serviciosRepository.obtenerTodos();
  res.json(servicios);
});

// POST /api/servicios (encargado)
export const crearServicio = asyncHandler(async (req, res) => {
  const errores = validarServicio(req.body);
  if (errores.length > 0) {
    res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
    return;
  }

  const datos = limpiarServicio(req.body);

  if (await serviciosRepository.existeNombre(datos.nombre)) {
    throw new ErrorHttp(409, "Ya existe un servicio con ese nombre.");
  }

  const creado = await serviciosRepository.crear(datos);
  res.status(201).json(creado);
});

// PUT /api/servicios/:id (encargado)
export const actualizarServicio = asyncHandler(async (req, res) => {
  const id = String(req.params.id);

  const actual = await serviciosRepository.obtenerPorId(id);
  if (!actual || !actual.activo) {
    throw new ErrorHttp(404, "No encontramos ese servicio.");
  }

  const errores = validarServicio(req.body);
  if (errores.length > 0) {
    res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
    return;
  }

  const datos = limpiarServicio(req.body);

  if (await serviciosRepository.existeNombre(datos.nombre, id)) {
    throw new ErrorHttp(409, "Ya existe un servicio con ese nombre.");
  }

  const actualizado = await serviciosRepository.actualizar(id, datos);
  res.json(actualizado);
});

// DELETE /api/servicios/:id (encargado). Lo desactiva; las citas anteriores lo conservan.
export const quitarServicio = asyncHandler(async (req, res) => {
  const id = String(req.params.id);

  const actual = await serviciosRepository.obtenerPorId(id);
  if (!actual || !actual.activo) {
    throw new ErrorHttp(404, "No encontramos ese servicio.");
  }

  await serviciosRepository.desactivar(id);
  res.json({ mensaje: "Servicio quitado." });
});