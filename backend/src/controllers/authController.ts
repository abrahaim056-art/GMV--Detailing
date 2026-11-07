import { NextFunction, Response, Request } from "express";
import { PeticionAutenticada } from "../middleware/autenticacion";
import * as usuariosRepository from "../repositories/usuariosRepository";
import { cifrar, comparar } from "../utils/contrasenas";
import { crearToken } from "../utils/token";
import { validarInicioSesion, validarRegistro } from "../utils/reglasUsuarios";

// Registro: siempre crea una cuenta con rol "cliente".
// El rol nunca se toma de lo que manda la persona.
export async function registrar(req: Request, res: Response, next: NextFunction) {
  try {
    const datos = req.body;

    const errores = validarRegistro(datos);
    if (errores.length > 0) {
      res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
      return;
    }

    const correo = datos.correo.trim().toLowerCase();

    const existente = await usuariosRepository.buscarPorCorreo(correo);
    if (existente) {
      res.status(409).json({ mensaje: "Ya existe una cuenta con ese correo." });
      return;
    }

    const contrasenaHash = await cifrar(datos.contrasena);
    const idNuevo = await usuariosRepository.crear({
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
      correo: correo,
      contrasenaHash: contrasenaHash,
      rol: "cliente",
    });

    const usuario = await usuariosRepository.buscarPorId(idNuevo);
    if (!usuario) {
      res.status(500).json({ mensaje: "No se pudo crear la cuenta." });
      return;
    }

    const token = crearToken({ id: usuario.id, rol: usuario.rol });
    res.status(201).json({ token: token, usuario: usuario });
  } catch (error) {
    next(error);
  }
}

export async function iniciarSesion(req: Request, res: Response, next: NextFunction) {
  try {
    const datos = req.body;

    const errores = validarInicioSesion(datos);
    if (errores.length > 0) {
      res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
      return;
    }

    const correo = datos.correo.trim().toLowerCase();
    const usuarioConClave = await usuariosRepository.buscarPorCorreo(correo);

    // El mismo mensaje para correo o contraseña incorrectos: así no se revela cuál falló.
    if (!usuarioConClave) {
      res.status(401).json({ mensaje: "El correo o la contraseña no son correctos." });
      return;
    }

    const coincide = await comparar(datos.contrasena, usuarioConClave.contrasenaHash);
    if (!coincide) {
      res.status(401).json({ mensaje: "El correo o la contraseña no son correctos." });
      return;
    }

    const token = crearToken({ id: usuarioConClave.id, rol: usuarioConClave.rol });
    res.json({
      token: token,
      usuario: {
        id: usuarioConClave.id,
        nombre: usuarioConClave.nombre,
        telefono: usuarioConClave.telefono,
        correo: usuarioConClave.correo,
        rol: usuarioConClave.rol,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Devuelve los datos de quien tiene la sesión iniciada.
export async function obtenerPerfil(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    if (!req.usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const usuario = await usuariosRepository.buscarPorId(req.usuario.id);
    if (!usuario) {
      res.status(404).json({ mensaje: "No encontramos tu cuenta." });
      return;
    }
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}
