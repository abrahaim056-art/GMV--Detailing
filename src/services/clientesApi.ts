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