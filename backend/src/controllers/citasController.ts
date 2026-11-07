import { NextFunction, Response } from "express";
import { PeticionAutenticada } from "../middleware/autenticacion";
import * as citasRepository from "../repositories/citasRepository";
import * as notificacionesRepository from "../repositories/notificacionesRepository";
import * as serviciosRepository from "../repositories/serviciosRepository";
import * as usuariosRepository from "../repositories/usuariosRepository";
import * as vehiculosRepository from "../repositories/vehiculosRepository";
import { DatosCitaNueva, EstadoCita } from "../types/cita";
import { obtenerMensajeEstado } from "../utils/mensajes";
import {
  estadosValidos,
  obtenerEstadosPermitidos,
  validarCitaCliente,
  validarNuevaCita,
} from "../utils/reglasCitas";

export async function listarCitas(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    const usuario = req.usuario;
    if (!usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    let fecha: string | undefined = undefined;
    let estado: string | undefined = undefined;
    let usuarioId: number | undefined = undefined;

    if (typeof req.query.fecha === "string") {
      fecha = req.query.fecha;
    }
    if (typeof req.query.estado === "string") {
      estado = req.query.estado;
    }

    // El cliente solo ve sus propias citas. El encargado ve todas.
    if (usuario.rol === "cliente") {
      usuarioId = usuario.id;
    }

    const citas = await citasRepository.obtenerTodas({
      fecha: fecha,
      estado: estado,
      usuarioId: usuarioId,
    });
    res.json(citas);
  } catch (error) {
    next(error);
  }
}

export async function obtenerCita(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    const usuario = req.usuario;
    if (!usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const id = Number(req.params.id);
    const cita = await citasRepository.obtenerPorId(id);

    // Si es de otro cliente respondemos igual que si no existiera.
    if (!cita || (usuario.rol === "cliente" && cita.usuarioId !== usuario.id)) {
      res.status(404).json({ mensaje: "No encontramos esa cita." });
      return;
    }
    res.json(cita);
  } catch (error) {
    next(error);
  }
}

export async function crearCita(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    const usuario = req.usuario;
    if (!usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const datos = req.body;
    let datosCita: DatosCitaNueva;

    if (usuario.rol === "cliente") {
      // El cliente agenda para sí mismo: elige uno de sus vehículos.
      const errores = validarCitaCliente(datos);
      if (errores.length > 0) {
        res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
        return;
      }

      const vehiculo = await vehiculosRepository.obtenerPorId(Number(datos.vehiculoId));
      if (!vehiculo || vehiculo.usuarioId !== usuario.id) {
        res.status(400).json({ mensaje: "Elige uno de tus vehículos." });
        return;
      }

      const perfil = await usuariosRepository.buscarPorId(usuario.id);
      if (!perfil) {
        res.status(401).json({ mensaje: "No encontramos tu cuenta." });
        return;
      }

      datosCita = {
        usuarioId: usuario.id,
        cliente: perfil.nombre,
        telefono: perfil.telefono,
        correo: perfil.correo,
        vehiculoId: vehiculo.id,
        vehiculo: vehiculo.descripcion,
        categoria: vehiculo.categoria,
        serviciosIds: datos.serviciosIds,
        fecha: datos.fecha,
        hora: datos.hora,
      };
    } else {
      // El encargado registra citas de personas sin cuenta (llamada, WhatsApp, local).
      const errores = validarNuevaCita(datos);
      if (errores.length > 0) {
        res.status(400).json({ mensaje: "Hay datos incorrectos.", errores: errores });
        return;
      }

      datosCita = {
        usuarioId: null,
        cliente: datos.cliente.trim(),
        telefono: (datos.telefono || "").trim(),
        correo: (datos.correo || "").trim(),
        vehiculoId: null,
        vehiculo: datos.vehiculo.trim(),
        categoria: datos.categoria,
        serviciosIds: datos.serviciosIds,
        fecha: datos.fecha,
        hora: datos.hora,
      };
    }

    // Los servicios elegidos deben existir en el catálogo.
    const servicios = await serviciosRepository.obtenerTodos();
    for (const idServicio of datosCita.serviciosIds) {
      let existe = false;
      for (const servicio of servicios) {
        if (servicio.id === idServicio) {
          existe = true;
        }
      }
      if (!existe) {
        res.status(400).json({ mensaje: "El servicio " + idServicio + " no existe." });
        return;
      }
    }

    // Regla 1: no se puede usar un horario ocupado.
    const ocupado = await citasRepository.existeCitaEnHorario(datosCita.fecha, datosCita.hora);
    if (ocupado) {
      res.status(409).json({ mensaje: "Ese horario ya está ocupado." });
      return;
    }

    const idNuevo = await citasRepository.crear(datosCita, usuario.id);

    // Si la cita es de una persona con cuenta, se le avisa.
    if (datosCita.usuarioId !== null) {
      await notificacionesRepository.crear(
        datosCita.usuarioId,
        idNuevo,
        "Tu cita del " + datosCita.fecha + " a las " + datosCita.hora + " quedó agendada."
      );
    }

    const citaCreada = await citasRepository.obtenerPorId(idNuevo);
    res.status(201).json(citaCreada);
  } catch (error) {
    next(error);
  }
}

export async function cambiarEstadoCita(req: PeticionAutenticada, res: Response, next: NextFunction) {
  try {
    const usuario = req.usuario;
    if (!usuario) {
      res.status(401).json({ mensaje: "Necesitas iniciar sesión." });
      return;
    }

    const id = Number(req.params.id);
    const nuevoEstado = req.body.estado;

    if (!estadosValidos.includes(nuevoEstado)) {
      res.status(400).json({ mensaje: "El estado no es válido." });
      return;
    }

    const cita = await citasRepository.obtenerPorId(id);
    if (!cita) {
      res.status(404).json({ mensaje: "No encontramos esa cita." });
      return;
    }

    if (usuario.rol === "cliente") {
      // El cliente solo puede cancelar sus propias citas.
      if (cita.usuarioId !== usuario.id) {
        res.status(404).json({ mensaje: "No encontramos esa cita." });
        return;
      }
      if (nuevoEstado !== "Cancelado") {
        res.status(403).json({ mensaje: "Como cliente solo puedes cancelar tu cita." });
        return;
      }
    }

    // Regla 3: solo se permiten los cambios de estado del flujo.
    const permitidos = obtenerEstadosPermitidos(cita.estado);
    if (!permitidos.includes(nuevoEstado as EstadoCita)) {
      res.status(409).json({
        mensaje: 'No se puede pasar de "' + cita.estado + '" a "' + nuevoEstado + '".',
      });
      return;
    }

    await citasRepository.cambiarEstado(id, nuevoEstado as EstadoCita, usuario.id);

    if (cita.usuarioId !== null) {
      await notificacionesRepository.crear(
        cita.usuarioId,
        cita.id,
        obtenerMensajeEstado(nuevoEstado as EstadoCita)
      );
    }

    const citaActualizada = await citasRepository.obtenerPorId(id);
    res.json(citaActualizada);
  } catch (error) {
    next(error);
  }
}
