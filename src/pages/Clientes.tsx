import { FormEvent, useState } from "react";
import { Cliente, DatosCliente } from "../types";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface ClientesProps {
  clientes: Cliente[];
  onAgregar: (datos: DatosCliente) => Promise<void>;
}

interface Errores {
  nombre?: string;
  telefono?: string;
  correo?: string;
  contacto?: string;
}

// Validaciones del formulario. La API vuelve a validar todo: esto solo evita
// viajes de ida y vuelta innecesarios.
function validarDatos(nombre: string, telefono: string, correo: string, clientes: Cliente[]): Errores {
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
    } else if (clientes.some((c) => c.telefono === telefonoLimpio)) {
      nuevos.telefono = "Ya existe un cliente con ese teléfono.";
    }
  }

  if (correoLimpio !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      nuevos.correo = "Escribe un correo válido. Ejemplo: nombre@correo.com";
    } else if (clientes.some((c) => c.correo.toLowerCase() === correoLimpio)) {
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

function ClientesPagina({ clientes, onAgregar }: ClientesProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setAviso("");
    setErrorApi("");

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

    setGuardando(true);
    try {
      await onAgregar(datos);
      setAviso("Cliente registrado: " + datos.nombre + ".");
      setNombre("");
      setTelefono("");
      setCorreo("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorApi(error.message);
      } else {
        setErrorApi("No se pudo registrar al cliente.");
      }
    }
    setGuardando(false);
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
              {clientes.map((cliente) => (
                <li key={cliente.id} className="flex flex-col gap-1 py-3">
                  <p className="font-bold text-gmv-negro">{cliente.nombre}</p>
                  <p className="text-sm text-gmv-gris">
                    {cliente.telefono !== "" ? cliente.telefono : "Sin teléfono"} ·{" "}
                    {cliente.correo !== "" ? cliente.correo : "Sin correo"}
                  </p>
                  <p className="text-xs text-gmv-gris">
                    Registrado el {formatearFecha(cliente.creadoEn)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default ClientesPagina;