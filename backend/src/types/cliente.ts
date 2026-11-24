export interface Cliente {
  id: number;
  nombre: string;
  telefono: string; // "" si no tiene
  correo: string; // "" si no tiene
  usuarioId: number | null; // cuenta de la app móvil, si tiene
  activo: boolean;
  creadoEn: string;
}

// Lo que manda el panel para registrar un cliente.
export interface DatosCliente {
  nombre: string;
  telefono: string;
  correo: string;
}