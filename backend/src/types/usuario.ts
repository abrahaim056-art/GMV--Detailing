export type Rol = "cliente" | "encargado";

export interface Usuario {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  rol: Rol;
}

export interface UsuarioConClave extends Usuario {
  contrasenaHash: string;
}

// Lo que se guarda dentro del token de sesión.
export interface DatosToken {
  id: number;
  rol: Rol;
}

export interface Vehiculo {
  id: number;
  usuarioId: number;
  descripcion: string;
  categoria: string;
}

export interface Notificacion {
  id: number;
  citaId: number | null;
  mensaje: string;
  leida: boolean;
  creadaEn: string;
}
