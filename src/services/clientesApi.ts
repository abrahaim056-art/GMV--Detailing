import { Cliente, DatosCliente } from "../types";
import { pedir } from "./apiBase";

// Clientes activos, los más recientes primero.
export function obtenerClientes(): Promise<Cliente[]> {
  return pedir<Cliente[]>("/clientes");
}

export function crearCliente(datos: DatosCliente): Promise<Cliente> {
  return pedir<Cliente>("/clientes", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function editarCliente(id: number, datos: DatosCliente): Promise<Cliente> {
  return pedir<Cliente>("/clientes/" + id, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

// "Eliminar" desactiva al cliente: las citas anteriores conservan sus datos.
export function eliminarCliente(id: number): Promise<{ mensaje: string }> {
  return pedir<{ mensaje: string }>("/clientes/" + id, { method: "DELETE" });
}