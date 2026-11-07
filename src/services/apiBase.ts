// Dirección de la API del backend (npm run dev dentro de /backend).
export const URL_API = "http://localhost:3000/api";

// Token de la sesión. Por ahora vive solo en memoria.
let token = "";

export function guardarToken(nuevoToken: string) {
  token = nuevoToken;
}

// Función base: hace la petición, manda el token y convierte la respuesta a JSON.
export async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const encabezados: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token !== "") {
    encabezados["Authorization"] = "Bearer " + token;
  }

  const respuesta = await fetch(URL_API + ruta, {
    ...opciones,
    headers: encabezados,
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    let mensaje = "Ocurrió un error.";
    if (datos.errores) {
      mensaje = datos.errores.join(" ");
    } else if (datos.mensaje) {
      mensaje = datos.mensaje;
    }
    throw new Error(mensaje);
  }

  return datos as T;
}
