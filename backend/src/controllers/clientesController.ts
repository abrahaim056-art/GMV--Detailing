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