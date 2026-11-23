import { FormEvent, useState } from "react";
import { ServicioExtra } from "../types";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface ServicioExtraProps {
  extras: ServicioExtra[];
  onAgregar: (extra: ServicioExtra) => void;
  onEditar: (extra: ServicioExtra) => void;
  onQuitar: (id: string) => void;
}

interface Errores {
  nombre?: string;
  precio?: string;
  minutos?: string;
}

// Validaciones compartidas por el formulario de alta y la edición en la lista.
function validarDatos(
  nombre: string,
  precio: string,
  minutos: string,
  extras: ServicioExtra[],
  idActual?: string
): Errores {
  const nuevos: Errores = {};
  const nombreLimpio = nombre.trim().toLowerCase();

  if (nombreLimpio === "") {
    nuevos.nombre = "Escribe el nombre del servicio.";
  } else if (
    extras.some((e) => e.id !== idActual && e.nombre.trim().toLowerCase() === nombreLimpio)
  ) {
    nuevos.nombre = "Ya existe un servicio con ese nombre.";
  }

  const numeroPrecio = Number(precio);
  if (precio.trim() === "" || isNaN(numeroPrecio) || numeroPrecio <= 0) {
    nuevos.precio = "Escribe un precio mayor a 0.";
  }

  const numeroMinutos = Number(minutos);
  if (minutos.trim() === "" || isNaN(numeroMinutos) || numeroMinutos <= 0) {
    nuevos.minutos = "Escribe el tiempo aproximado en minutos.";
  }

  return nuevos;
}

function ServicioExtraPagina({ extras, onAgregar, onEditar, onQuitar }: ServicioExtraProps) {
  // Formulario para agregar
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [minutos, setMinutos] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  // Edición en la misma fila
  const [editandoId, setEditandoId] = useState("");
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editMinutos, setEditMinutos] = useState("");
  const [erroresEdicion, setErroresEdicion] = useState<Errores>({});

  const [aviso, setAviso] = useState("");

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setAviso("");

    const erroresEncontrados = validarDatos(nombre, precio, minutos, extras);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    onAgregar({
      id: "extra-" + Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      minutos: Number(minutos),
    });
    setAviso("Servicio agregado: " + nombre.trim() + ".");
    setNombre("");
    setPrecio("");
    setMinutos("");
  }

  function empezarEdicion(extra: ServicioExtra) {
    setAviso("");
    setErroresEdicion({});
    setEditandoId(extra.id);
    setEditNombre(extra.nombre);
    setEditPrecio(String(extra.precio));
    setEditMinutos(String(extra.minutos));
  }

  function cancelarEdicion() {
    setEditandoId("");
    setErroresEdicion({});
  }

  function guardarEdicion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroresEncontrados = validarDatos(editNombre, editPrecio, editMinutos, extras, editandoId);
    setErroresEdicion(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    onEditar({
      id: editandoId,
      nombre: editNombre.trim(),
      precio: Number(editPrecio),
      minutos: Number(editMinutos),
    });
    setAviso("Servicio actualizado: " + editNombre.trim() + ".");
    setEditandoId("");
  }

  function quitar(extra: ServicioExtra) {
    if (editandoId === extra.id) {
      cancelarEdicion();
    }
    onQuitar(extra.id);
    setAviso("Servicio quitado: " + extra.nombre + ".");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Servicios extra e individuales</h1>
        <p className="text-gmv-gris">
          Estos servicios se pueden sumar a un paquete como extra, o elegirse solos en una cita sin
          paquete. El tiempo es aproximado.
        </p>
      </div>

      {aviso !== "" && <Mensaje tipo="exito" texto={aviso} />}

      <div className="grid items-start gap-6 lg:grid-cols-[330px_1fr]">
        <form
          onSubmit={manejarEnvio}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="font-bold text-gmv-negro">Agregar servicio</h2>
          <CampoTexto
            id="extra-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambio={setNombre}
            error={errores.nombre}
            marcador="Aspirado interior"
          />
          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              id="extra-precio"
              etiqueta="Precio ($)"
              tipo="number"
              valor={precio}
              onCambio={setPrecio}
              error={errores.precio}
              marcador="100"
            />
            <CampoTexto
              id="extra-minutos"
              etiqueta="Tiempo (min)"
              tipo="number"
              valor={minutos}
              onCambio={setMinutos}
              error={errores.minutos}
              marcador="20"
            />
          </div>
          <Boton type="submit">Agregar servicio</Boton>
        </form>

        <section
          aria-label="Lista de servicios"
          className="rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="mb-3 font-bold text-gmv-negro">Servicios disponibles ({extras.length})</h2>

          {extras.length === 0 ? (
            <p className="text-sm text-gmv-gris">
              Todavía no hay servicios. Agrega el primero con el formulario.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gmv-borde">
              {extras.map((extra) => (
                <li key={extra.id} className="py-3">
                  {editandoId === extra.id ? (
                    <form
                      onSubmit={guardarEdicion}
                      noValidate
                      aria-label={"Editar " + extra.nombre}
                      className="flex flex-col gap-4"
                    >
                      <CampoTexto
                        id={"editar-nombre-" + extra.id}
                        etiqueta="Nombre"
                        valor={editNombre}
                        onCambio={setEditNombre}
                        error={erroresEdicion.nombre}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <CampoTexto
                          id={"editar-precio-" + extra.id}
                          etiqueta="Precio ($)"
                          tipo="number"
                          valor={editPrecio}
                          onCambio={setEditPrecio}
                          error={erroresEdicion.precio}
                        />
                        <CampoTexto
                          id={"editar-minutos-" + extra.id}
                          etiqueta="Tiempo (min)"
                          tipo="number"
                          valor={editMinutos}
                          onCambio={setEditMinutos}
                          error={erroresEdicion.minutos}
                        />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Boton type="submit">Guardar cambios</Boton>
                        <button
                          type="button"
                          onClick={cancelarEdicion}
                          className="rounded-xl border-2 border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gmv-negro hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-gmv-negro">{extra.nombre}</p>
                        <p className="text-sm text-gmv-gris">
                          ${extra.precio} · aprox. {extra.minutos} min
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => empezarEdicion(extra)}
                          aria-label={"Editar " + extra.nombre}
                          className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-negro hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => quitar(extra)}
                          aria-label={"Quitar " + extra.nombre}
                          className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-rojo hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  )}
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