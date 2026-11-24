import { FormEvent, useState } from "react";
import { Cliente, DatosCliente } from "../types";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface ClientesProps {
  clientes: Cliente[];
  onAgregar: (datos: DatosCliente) => Promise<void>;
  onEditar: (id: number, datos: DatosCliente) => Promise<void>;
  onEliminar: (id: number) => Promise<void>;
}

interface Errores {
  nombre?: string;
  telefono?: string;
  correo?: string;
  contacto?: string;
}

// Validaciones compartidas por el formulario de alta y la edición en la lista.
// La API vuelve a validar todo: esto solo evita viajes de ida y vuelta innecesarios.
// Al editar se pasa idActual para que el cliente no cuente como repetido contra sí mismo.
function validarDatos(
  nombre: string,
  telefono: string,
  correo: string,
  clientes: Cliente[],
  idActual?: number
): Errores {
  const nuevos: Errores = {};
  const telefonoLimpio = telefono.trim();
  const correoLimpio = correo.trim().toLowerCase();

  if (nombre.trim() === "") {
    nuevos.nombre = "Escribe el nombre del cliente.";
  }

  if (telefonoLimpio === "" && correoLimpio === "") {
    nuevos.contacto = "Escribe un teléfono o un correo de contacto.";
  }

  if (telefonoLimpio !== "") {
    if (!/^[0-9+()\-\s]{7,}$/.test(telefonoLimpio)) {
      nuevos.telefono = "El teléfono solo puede llevar números, espacios, + - y paréntesis.";
    } else if (clientes.some((c) => c.id !== idActual && c.telefono === telefonoLimpio)) {
      nuevos.telefono = "Ya existe un cliente con ese teléfono.";
    }
  }

  if (correoLimpio !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      nuevos.correo = "Escribe un correo válido. Ejemplo: nombre@correo.com";
    } else if (clientes.some((c) => c.id !== idActual && c.correo.toLowerCase() === correoLimpio)) {
      nuevos.correo = "Ya existe un cliente con ese correo.";
    }
  }

  return nuevos;
}

// "2026-11-22 14:03:00" -> "22/11/2026"
function formatearFecha(texto: string): string {
  const fecha = texto.slice(0, 10).split("-");
  if (fecha.length !== 3) {
    return texto;
  }
  return fecha[2] + "/" + fecha[1] + "/" + fecha[0];
}

function ClientesPagina({ clientes, onAgregar, onEditar, onEliminar }: ClientesProps) {
  // Formulario para agregar
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  // Edición en la misma fila (0 = nadie se está editando)
  const [editandoId, setEditandoId] = useState(0);
  const [editNombre, setEditNombre] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editCorreo, setEditCorreo] = useState("");
  const [erroresEdicion, setErroresEdicion] = useState<Errores>({});

  // Cliente al que se le pidió confirmación para eliminar (0 = ninguno)
  const [confirmandoId, setConfirmandoId] = useState(0);

  const [aviso, setAviso] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [guardando, setGuardando] = useState(false);

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

    const erroresEncontrados = validarDatos(nombre, telefono, correo, clientes);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    const datos: DatosCliente = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
    };

    const exito = await ejecutar(() => onAgregar(datos), "Cliente registrado: " + datos.nombre + ".");
    if (exito) {
      setNombre("");
      setTelefono("");
      setCorreo("");
    }
  }

  function empezarEdicion(cliente: Cliente) {
    setAviso("");
    setErrorApi("");
    setErroresEdicion({});
    setConfirmandoId(0);
    setEditandoId(cliente.id);
    setEditNombre(cliente.nombre);
    setEditTelefono(cliente.telefono);
    setEditCorreo(cliente.correo);
  }

  function cancelarEdicion() {
    setEditandoId(0);
    setErroresEdicion({});
  }

  async function guardarEdicion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const erroresEncontrados = validarDatos(editNombre, editTelefono, editCorreo, clientes, editandoId);
    setErroresEdicion(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    const datos: DatosCliente = {
      nombre: editNombre.trim(),
      telefono: editTelefono.trim(),
      correo: editCorreo.trim(),
    };

    const exito = await ejecutar(
      () => onEditar(editandoId, datos),
      "Cliente actualizado: " + datos.nombre + "."
    );
    if (exito) {
      setEditandoId(0);
    }
  }

  function pedirConfirmacion(cliente: Cliente) {
    setAviso("");
    setErrorApi("");
    setEditandoId(0);
    setConfirmandoId(cliente.id);
  }

  async function eliminar(cliente: Cliente) {
    const exito = await ejecutar(
      () => onEliminar(cliente.id),
      "Cliente eliminado: " + cliente.nombre + "."
    );
    if (exito) {
      setConfirmandoId(0);
    }
  }

  // Una fila de la lista: se ve el cliente, se edita en el mismo lugar o se confirma eliminarlo.
  function renderizarFila(cliente: Cliente) {
    if (editandoId === cliente.id) {
      return (
        <li key={cliente.id} className="py-3">
          <form
            onSubmit={guardarEdicion}
            noValidate
            aria-label={"Editar " + cliente.nombre}
            className="flex flex-col gap-4"
          >
            <CampoTexto
              id={"editar-nombre-" + cliente.id}
              etiqueta="Nombre"
              valor={editNombre}
              onCambio={setEditNombre}
              error={erroresEdicion.nombre}
            />
            <CampoTexto
              id={"editar-telefono-" + cliente.id}
              etiqueta="Teléfono"
              tipo="tel"
              valor={editTelefono}
              onCambio={setEditTelefono}
              error={erroresEdicion.telefono}
            />
            <CampoTexto
              id={"editar-correo-" + cliente.id}
              etiqueta="Correo"
              tipo="email"
              valor={editCorreo}
              onCambio={setEditCorreo}
              error={erroresEdicion.correo}
              ayuda="Teléfono y correo: con uno de los dos basta."
            />
            {erroresEdicion.contacto && (
              <p role="alert" className="-mt-2 text-sm font-semibold text-gmv-rojo">
                {erroresEdicion.contacto}
              </p>
            )}
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

    if (confirmandoId === cliente.id) {
      return (
        <li key={cliente.id} className="flex flex-col gap-3 py-3">
          <p role="alert" className="text-sm font-semibold text-gmv-negro">
            ¿Seguro que quieres eliminar a {cliente.nombre}? Sus citas anteriores se conservan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Boton variante="peligro" onClick={() => eliminar(cliente)} disabled={guardando}>
              {guardando ? "Eliminando..." : "Sí, eliminar"}
            </Boton>
            <Boton variante="secundario" onClick={() => setConfirmandoId(0)} disabled={guardando}>
              Cancelar
            </Boton>
          </div>
        </li>
      );
    }

    return (
      <li key={cliente.id} className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gmv-negro">{cliente.nombre}</p>
          <p className="text-sm text-gmv-gris">
            {cliente.telefono !== "" ? cliente.telefono : "Sin teléfono"} ·{" "}
            {cliente.correo !== "" ? cliente.correo : "Sin correo"}
          </p>
          <p className="text-xs text-gmv-gris">Registrado el {formatearFecha(cliente.creadoEn)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => empezarEdicion(cliente)}
            disabled={guardando}
            aria-label={"Editar " + cliente.nombre}
            className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-negro hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado disabled:opacity-60"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => pedirConfirmacion(cliente)}
            disabled={guardando}
            aria-label={"Eliminar " + cliente.nombre}
            className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gmv-rojo hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Clientes</h1>
        <p className="text-gmv-gris">
          Registra a tus clientes con su nombre y al menos un dato de contacto (teléfono o correo).
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
          <h2 className="font-bold text-gmv-negro">Agregar cliente</h2>
          <CampoTexto
            id="cliente-nombre"
            etiqueta="Nombre"
            valor={nombre}
            onCambio={setNombre}
            error={errores.nombre}
            marcador="Carlos Ramírez"
          />
          <CampoTexto
            id="cliente-telefono"
            etiqueta="Teléfono"
            tipo="tel"
            valor={telefono}
            onCambio={setTelefono}
            error={errores.telefono}
            marcador="998 111 2233"
          />
          <CampoTexto
            id="cliente-correo"
            etiqueta="Correo"
            tipo="email"
            valor={correo}
            onCambio={setCorreo}
            error={errores.correo}
            marcador="cliente@correo.com"
            ayuda="Teléfono y correo: con uno de los dos basta."
          />
          {errores.contacto && (
            <p role="alert" className="-mt-2 text-sm font-semibold text-gmv-rojo">
              {errores.contacto}
            </p>
          )}
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Agregar cliente"}
          </Boton>
        </form>

        <section
          aria-label="Lista de clientes"
          className="rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <h2 className="mb-3 font-bold text-gmv-negro">Clientes ({clientes.length})</h2>
          {clientes.length === 0 ? (
            <p className="text-sm text-gmv-gris">
              Todavía no hay clientes. Agrega el primero con el formulario.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gmv-borde">
              {clientes.map((cliente) => renderizarFila(cliente))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default ClientesPagina;