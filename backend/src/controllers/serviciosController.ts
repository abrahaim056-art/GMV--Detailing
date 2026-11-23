import { NextFunction, Request, Response } from "express";
import * as serviciosRepository from "../repositories/serviciosRepository";
import { ErrorHttp } from "../utils/errores";
import { limpiarServicio, validarServicio } from "../utils/reglasServicios";

// GET /api/servicios (público: lo usa también la app móvil)
export async function listarServicios(req: Request, res: Response, next: NextFunction) {
  try {
    const servicios = await serviciosRepository.obtenerTodos();
    res.json(servicios);
  } catch (error) {
    next(error);
  }
}

// POST /api/servicios (encargado)
export async function crearServicio(req: Request, res: Response, next: NextFunction) {
  try {
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
  } catch (error) {
    next(error);
  }
}

// PUT /api/servicios/:id (encargado)
export async function actualizarServicio(req: Request, res: Response, next: NextFunction) {
  try {
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
  } catch (error) {
    next(error);
  }
}

// DELETE /api/servicios/:id (encargado). Lo desactiva; las citas anteriores lo conservan.
export async function quitarServicio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);

    const actual = await serviciosRepository.obtenerPorId(id);
    if (!actual || !actual.activo) {
      throw new ErrorHttp(404, "No encontramos ese servicio.");
    }

    await serviciosRepository.desactivar(id);
    res.json({ mensaje: "Servicio quitado." });
  } catch (error) {
    next(error);
  }
}
