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

  let respuesta: Response;
  try {
    respuesta = await fetch(URL_API + ruta, {
      ...opciones,
      headers: encabezados,
    });
  } catch (error) {
    // La API está apagada o no se alcanza: nunca se debe mostrar un éxito falso.
    throw new Error("No se pudo conectar con el servidor. Revisa que la API esté encendida.");
  }

  let datos: any = null;
  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = null;
  }

  if (!respuesta.ok) {
    let mensaje = "Ocurrió un error.";
    if (datos && datos.errores) {
      mensaje = datos.errores.join(" ");
    } else if (datos && datos.mensaje) {
      mensaje = datos.mensaje;
    }
    throw new Error(mensaje);
  }

  return datos as T;
}
