import { FormEvent, useState } from "react";
import { ServicioExtra } from "../types";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface ServicioExtraProps {
  extras: ServicioExtra[];
  onAgregar: (extra: ServicioExtra) => void;
  onQuitar: (id: string) => void;
}

interface Errores {
  nombre?: string;
  precio?: string;
}

function ServicioExtraPagina({ extras, onAgregar, onQuitar }: ServicioExtraProps) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState("");

  function validar(): Errores {
    const nuevos: Errores = {};
    const nombreLimpio = nombre.trim().toLowerCase();

    if (nombreLimpio === "") {
      nuevos.nombre = "Escribe el nombre del servicio.";
    } else if (extras.some((e) => e.nombre.trim().toLowerCase() === nombreLimpio)) {
      nuevos.nombre = "Ya existe un servicio extra con ese nombre.";
    }

    const numero = Number(precio);
    if (precio.trim() === "" || isNaN(numero) || numero <= 0) {
      nuevos.precio = "Escribe un precio mayor a 0.";
    }
    return nuevos;
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setAviso("");

    const erroresEncontrados = validar();
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    onAgregar({
      id: "extra-" + Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
    });
    setAviso("Servicio extra agregado: " + nombre.trim() + ".");
    setNombre("");
    setPrecio("");
  }

  function quitar(extra: ServicioExtra) {
    onQuitar(extra.id);
    setAviso("Servicio extra quitado: " + extra.nombre + ".");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Servicios extra</h1>
        <p className="text-gmv-gris">
          Los servicios que agregues aquí se pueden sumar a cualquier cita nueva.
        </p>
      </div>

      {aviso !== "" && <Mensaje tipo="exito" texto={aviso} />}

      <div className="grid items-start gap-6 lg:grid-cols-[330px_1fr]">
        <form
          onSubmit={manejarEnvio}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="font-bold text-gmv-negro">Agregar servicio extra</h2>
          <CampoTexto
            id="extra-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambio={setNombre}
            error={errores.nombre}
            marcador="Encerado de rines"
          />
          <CampoTexto
            id="extra-precio"
            etiqueta="Precio ($)"
            tipo="number"
            valor={precio}
            onCambio={setPrecio}
            error={errores.precio}
            marcador="100"
          />
          <Boton type="submit">Agregar servicio</Boton>
        </form>

        <section
          aria-label="Lista de servicios extra"
          className="rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="mb-3 font-bold text-gmv-negro">
            Servicios extra disponibles ({extras.length})
          </h2>

          {extras.length === 0 ? (
            <p className="text-sm text-gmv-gris">
              Todavía no hay servicios extra. Agrega el primero con el formulario.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gmv-borde">
              {extras.map((extra) => (
                <li key={extra.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-bold text-gmv-negro">{extra.nombre}</p>
                    <p className="text-sm text-gmv-gris">+${extra.precio}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => quitar(extra)}
                    aria-label={"Quitar " + extra.nombre}
                    className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-rojo hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default ServicioExtraPagina;