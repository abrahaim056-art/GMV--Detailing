import { NextFunction, Request, Response } from "express";
import * as clientesRepository from "../repositories/clientesRepository";
import { ErrorHttp } from "../utils/errores";
import { limpiarCliente, validarCliente } from "../utils/reglasClientes";

// GET /api/clientes (encargado)
export async function listarClientes(req: Request, res: Response, next: NextFunction) {
  try {
    const clientes = await clientesRepository.obtenerTodos();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

// POST /api/clientes (encargado)
export async function crearCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const errores = validarCliente(req.body);
    if (errores.length > 0) {
      res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
      return;
    }

    const datos = limpiarCliente(req.body);

    if (await clientesRepository.existeCorreo(datos.correo)) {
      throw new ErrorHttp(409, "Ya existe un cliente con ese correo.");
    }
    if (await clientesRepository.existeTelefono(datos.telefono)) {
      throw new ErrorHttp(409, "Ya existe un cliente con ese teléfono.");
    }

    const creado = await clientesRepository.crear(datos);
    res.status(201).json(creado);
  } catch (error) {
    next(error);
  }
}

// Convierte el :id de la ruta en número (si no es un número válido, no existe).
function leerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorHttp(404, "No encontramos ese cliente.");
  }
  return id;
}

// PUT /api/clientes/:id (encargado)
export async function actualizarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const id = leerId(req);

    const actual = await clientesRepository.obtenerPorId(id);
    if (!actual || !actual.activo) {
      throw new ErrorHttp(404, "No encontramos ese cliente.");
    }

    const errores = validarCliente(req.body);
    if (errores.length > 0) {
      res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
      return;
    }

    const datos = limpiarCliente(req.body);

    if (await clientesRepository.existeCorreo(datos.correo, id)) {
      throw new ErrorHttp(409, "Ya existe un cliente con ese correo.");
    }
    if (await clientesRepository.existeTelefono(datos.telefono, id)) {
      throw new ErrorHttp(409, "Ya existe un cliente con ese teléfono.");
    }

    const actualizado = await clientesRepository.actualizar(id, datos);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/clientes/:id (encargado). Lo desactiva; las citas anteriores no cambian.
export async function eliminarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const id = leerId(req);

    const actual = await clientesRepository.obtenerPorId(id);
    if (!actual || !actual.activo) {
      throw new ErrorHttp(404, "No encontramos ese cliente.");
    }

    await clientesRepository.desactivar(id);
    res.json({ mensaje: "Cliente eliminado." });
  } catch (error) {
    next(error);
  }
}