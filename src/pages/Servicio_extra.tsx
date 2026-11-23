import { FormEvent, useState } from "react";
import { DatosServicio, Servicio, TipoServicio } from "../types";
import CampoTexto from "../components/CampoTexto";
import CampoSelect from "../components/CampoSelect";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface ServicioExtraProps {
  servicios: Servicio[];
  onAgregar: (datos: DatosServicio) => Promise<void>;
  onEditar: (id: string, datos: DatosServicio) => Promise<void>;
  onQuitar: (id: string) => Promise<void>;
}

interface Errores {
  nombre?: string;
  precio?: string;
  minutos?: string;
  tipo?: string;
}

const TEXTO_PAQUETE = "Paquete";
const TEXTO_SUELTO = "Servicio suelto";
const opcionesTipo: string[] = [TEXTO_SUELTO, TEXTO_PAQUETE];

function tipoDesdeTexto(texto: string): TipoServicio {
  return texto === TEXTO_PAQUETE ? "paquete" : "extra";
}

function textoDesdeTipo(tipo: TipoServicio): string {
  return tipo === "paquete" ? TEXTO_PAQUETE : TEXTO_SUELTO;
}

// Validaciones compartidas por el formulario de alta y la edición en la lista.
// La API vuelve a validar todo: esto solo evita viajes de ida y vuelta innecesarios.
function validarDatos(
  nombre: string,
  precio: string,
  minutos: string,
  tipoTexto: string,
  servicios: Servicio[],
  idActual?: string
): Errores {
  const nuevos: Errores = {};
  const nombreLimpio = nombre.trim().toLowerCase();

  if (nombreLimpio === "") {
    nuevos.nombre = "Escribe el nombre del servicio.";
  } else if (
    servicios.some((s) => s.id !== idActual && s.nombre.trim().toLowerCase() === nombreLimpio)
  ) {
    nuevos.nombre = "Ya existe un servicio con ese nombre.";
  }

  const numeroPrecio = Number(precio);
  if (precio.trim() === "" || isNaN(numeroPrecio) || numeroPrecio <= 0) {
    nuevos.precio = "Escribe un precio mayor a 0.";
  }

  const numeroMinutos = Number(minutos);
  if (minutos.trim() === "" || !Number.isInteger(numeroMinutos) || numeroMinutos <= 0) {
    nuevos.minutos = "Escribe el tiempo aproximado en minutos (número entero).";
  }

  if (tipoTexto === "") {
    nuevos.tipo = "Elige si es un paquete o un servicio suelto.";
  }

  return nuevos;
}

function ServicioExtraPagina({ servicios, onAgregar, onEditar, onQuitar }: ServicioExtraProps) {
  // Formulario para agregar
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [minutos, setMinutos] = useState("");
  const [tipoTexto, setTipoTexto] = useState(TEXTO_SUELTO);
  const [errores, setErrores] = useState<Errores>({});

  // Edición en la misma fila
  const [editandoId, setEditandoId] = useState("");
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editMinutos, setEditMinutos] = useState("");
  const [editTipoTexto, setEditTipoTexto] = useState(TEXTO_SUELTO);
  const [erroresEdicion, setErroresEdicion] = useState<Errores>({});

  const [aviso, setAviso] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [guardando, setGuardando] = useState(false);

  const paquetes = servicios.filter((s) => s.tipo === "paquete");
  const sueltos = servicios.filter((s) => s.tipo === "extra");

  // Ejecuta una operación contra la API y muestra su resultado (éxito o error).
  async function ejecutar(operacion: () => Promise<void>, textoExito: string): Promise<boolean> {
    setAviso("");
    setErrorApi("");
    setGuardando(true);
    try {
      await operacion();
      setAviso(textoExito);
      setGuardando(false);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setErrorApi(error.message);
      } else {
        setErrorApi("No se pudo completar la operación.");
      }
      setGuardando(false);
      return false;
    }
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroresEncontrados = validarDatos(nombre, precio, minutos, tipoTexto, servicios);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    const datos: DatosServicio = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      minutos: Number(minutos),
      tipo: tipoDesdeTexto(tipoTexto),
    };

    const exito = await ejecutar(() => onAgregar(datos), "Servicio agregado: " + datos.nombre + ".");
    if (exito) {
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setMinutos("");
      setTipoTexto(TEXTO_SUELTO);
    }
  }

  function empezarEdicion(servicio: Servicio) {
    setAviso("");
    setErrorApi("");
    setErroresEdicion({});
    setEditandoId(servicio.id);
    setEditNombre(servicio.nombre);
    setEditDescripcion(servicio.descripcion);
    setEditPrecio(String(servicio.precio));
    setEditMinutos(String(servicio.minutos));
    setEditTipoTexto(textoDesdeTipo(servicio.tipo));
  }

  function cancelarEdicion() {
    setEditandoId("");
    setErroresEdicion({});
  }

  async function guardarEdicion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroresEncontrados = validarDatos(
      editNombre,
      editPrecio,
      editMinutos,
      editTipoTexto,
      servicios,
      editandoId
    );
    setErroresEdicion(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    const datos: DatosServicio = {
      nombre: editNombre.trim(),
      descripcion: editDescripcion.trim(),
      precio: Number(editPrecio),
      minutos: Number(editMinutos),
      tipo: tipoDesdeTexto(editTipoTexto),
    };

    const exito = await ejecutar(
      () => onEditar(editandoId, datos),
      "Servicio actualizado: " + datos.nombre + "."
    );
    if (exito) {
      setEditandoId("");
    }
  }

  async function quitar(servicio: Servicio) {
    if (editandoId === servicio.id) {
      cancelarEdicion();
    }
    await ejecutar(() => onQuitar(servicio.id), "Servicio quitado: " + servicio.nombre + ".");
  }

  // Una fila de la lista: o se ve el servicio, o se edita en el mismo lugar.
  function renderizarFila(servicio: Servicio) {
    if (editandoId === servicio.id) {
      return (
        <li key={servicio.id} className="py-3">
          <form
            onSubmit={guardarEdicion}
            noValidate
            aria-label={"Editar " + servicio.nombre}
            className="flex flex-col gap-4"
          >
            <CampoTexto
              id={"editar-nombre-" + servicio.id}
              etiqueta="Nombre"
              valor={editNombre}
              onCambio={setEditNombre}
              error={erroresEdicion.nombre}
            />
            <CampoTexto
              id={"editar-descripcion-" + servicio.id}
              etiqueta="Descripción (opcional)"
              valor={editDescripcion}
              onCambio={setEditDescripcion}
            />
            <div className="grid grid-cols-2 gap-4">
              <CampoTexto
                id={"editar-precio-" + servicio.id}
                etiqueta="Precio ($)"
                tipo="number"
                valor={editPrecio}
                onCambio={setEditPrecio}
                error={erroresEdicion.precio}
              />
              <CampoTexto
                id={"editar-minutos-" + servicio.id}
                etiqueta="Tiempo (min)"
                tipo="number"
                valor={editMinutos}
                onCambio={setEditMinutos}
                error={erroresEdicion.minutos}
              />
            </div>
            <CampoSelect
              id={"editar-tipo-" + servicio.id}
              etiqueta="Tipo"
              valor={editTipoTexto}
              opciones={opcionesTipo}
              onCambio={setEditTipoTexto}
              error={erroresEdicion.tipo}
            />
            <div className="flex flex-wrap gap-3">
              <Boton type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </Boton>
              <Boton variante="secundario" onClick={cancelarEdicion} disabled={guardando}>
                Cancelar
              </Boton>
            </div>
          </form>
        </li>
      );
    }

    return (
      <li key={servicio.id} className="flex items-center justify-between gap-4 py-3">
        <div>
          <p className="font-bold text-gmv-negro">{servicio.nombre}</p>
          {servicio.descripcion !== "" && (
            <p className="text-sm text-gmv-gris">{servicio.descripcion}</p>
          )}
          <p className="text-sm text-gmv-gris">
            ${servicio.precio} · aprox. {servicio.minutos} min
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => empezarEdicion(servicio)}
            disabled={guardando}
            aria-label={"Editar " + servicio.nombre}
            className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-negro hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado disabled:opacity-60"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => quitar(servicio)}
            disabled={guardando}
            aria-label={"Quitar " + servicio.nombre}
            className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-rojo hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado disabled:opacity-60"
          >
            Quitar
          </button>
        </div>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Servicios</h1>
        <p className="text-gmv-gris">
          Los paquetes se eligen al registrar una cita. Los servicios sueltos se pueden sumar a un
          paquete o elegirse solos. El tiempo es aproximado.
        </p>
      </div>

      {aviso !== "" && <Mensaje tipo="exito" texto={aviso} />}
      {errorApi !== "" && <Mensaje tipo="error" texto={errorApi} />}

      <div className="grid items-start gap-6 lg:grid-cols-[330px_1fr]">
        <form
          onSubmit={manejarEnvio}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="font-bold text-gmv-negro">Agregar servicio</h2>
          <CampoTexto
            id="servicio-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambio={setNombre}
            error={errores.nombre}
            marcador="Aspirado interior"
          />
          <CampoTexto
            id="servicio-descripcion"
            etiqueta="Descripción (opcional)"
            valor={descripcion}
            onCambio={setDescripcion}
          />
          <div className="grid grid-cols-2 gap-4">
            <CampoTexto
              id="servicio-precio"
              etiqueta="Precio ($)"
              tipo="number"
              valor={precio}
              onCambio={setPrecio}
              error={errores.precio}
              marcador="100"
            />
            <CampoTexto
              id="servicio-minutos"
              etiqueta="Tiempo (min)"
              tipo="number"
              valor={minutos}
              onCambio={setMinutos}
              error={errores.minutos}
              marcador="20"
            />
          </div>
          <CampoSelect
            id="servicio-tipo"
            etiqueta="Tipo"
            valor={tipoTexto}
            opciones={opcionesTipo}
            onCambio={setTipoTexto}
            error={errores.tipo}
          />
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Agregar servicio"}
          </Boton>
        </form>

        <div className="flex flex-col gap-6">
          <section
            aria-label="Paquetes"
            className="rounded-2xl border border-gmv-borde bg-white p-6"
          >
            <h2 className="mb-3 font-bold text-gmv-negro">Paquetes ({paquetes.length})</h2>
            {paquetes.length === 0 ? (
              <p className="text-sm text-gmv-gris">No hay paquetes. Agrega uno con el formulario.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-gmv-borde">
                {paquetes.map((servicio) => renderizarFila(servicio))}
              </ul>
            )}
          </section>

          <section
            aria-label="Servicios sueltos"
            className="rounded-2xl border border-gmv-borde bg-white p-6"
          >
            <h2 className="mb-3 font-bold text-gmv-negro">Servicios sueltos ({sueltos.length})</h2>
            {sueltos.length === 0 ? (
              <p className="text-sm text-gmv-gris">
                Todavía no hay servicios sueltos. Agrega el primero con el formulario.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-gmv-borde">
                {sueltos.map((servicio) => renderizarFila(servicio))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ServicioExtraPagina;
