import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Cita, CategoriaVehiculo } from "../types";
import { categorias, servicios } from "../data/servicios";
import { HOY, citaOcupaHorario, horarios } from "../data/citas";
import CampoTexto from "../components/CampoTexto";
import CampoSelect from "../components/CampoSelect";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface NuevaCitaProps {
  citas: Cita[];
  onGuardar: (cita: Cita) => void;
}

interface Errores {
  cliente?: string;
  contacto?: string;
  vehiculo?: string;
  categoria?: string;
  servicios?: string;
  fecha?: string;
  hora?: string;
}

function NuevaCita({ citas, onGuardar }: NuevaCitaProps) {
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [serviciosElegidos, setServiciosElegidos] = useState<string[]>([]);
  const [fecha, setFecha] = useState(HOY);
  const [hora, setHora] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [guardada, setGuardada] = useState(false);

  function marcarServicio(idServicio: string) {
    if (serviciosElegidos.includes(idServicio)) {
      const sinEseServicio = serviciosElegidos.filter((id) => id !== idServicio);
      setServiciosElegidos(sinEseServicio);
    } else {
      setServiciosElegidos([...serviciosElegidos, idServicio]);
    }
  }

  function validar(): Errores {
    const nuevosErrores: Errores = {};

    if (cliente.trim() === "") {
      nuevosErrores.cliente = "Escribe el nombre del cliente.";
    }

    // Regla 4: se necesita al menos un dato de contacto.
    if (telefono.trim() === "" && correo.trim() === "") {
      nuevosErrores.contacto = "Escribe un teléfono o un correo para poder avisar al cliente.";
    }

    if (vehiculo.trim() === "") {
      nuevosErrores.vehiculo = "Escribe la marca y modelo del vehículo.";
    }

    // Regla 2: categoría del vehículo y al menos un servicio.
    if (categoria === "") {
      nuevosErrores.categoria = "Selecciona la categoría del vehículo.";
    }
    if (serviciosElegidos.length === 0) {
      nuevosErrores.servicios = "Selecciona al menos un servicio.";
    }

    if (fecha === "") {
      nuevosErrores.fecha = "Selecciona una fecha.";
    }
    if (hora === "") {
      nuevosErrores.hora = "Selecciona un horario.";
    }

    // Regla 1: no se puede usar un horario que ya está ocupado.
    if (fecha !== "" && hora !== "") {
      for (const cita of citas) {
        if (cita.fecha === fecha && cita.hora === hora && citaOcupaHorario(cita)) {
          nuevosErrores.hora = "Ese horario ya está ocupado. Elige otro.";
        }
      }
    }

    return nuevosErrores;
  }

  function limpiarFormulario() {
    setCliente("");
    setTelefono("");
    setCorreo("");
    setVehiculo("");
    setCategoria("");
    setServiciosElegidos([]);
    setFecha(HOY);
    setHora("");
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setGuardada(false);

    const erroresEncontrados = validar();
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    // Se calcula el siguiente id a partir del más grande que existe.
    let mayorId = 0;
    for (const cita of citas) {
      if (cita.id > mayorId) {
        mayorId = cita.id;
      }
    }

    const nuevaCita: Cita = {
      id: mayorId + 1,
      cliente: cliente.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      vehiculo: vehiculo.trim(),
      categoria: categoria as CategoriaVehiculo,
      serviciosIds: serviciosElegidos,
      fecha: fecha,
      hora: hora,
      estado: "Agendado",
    };

    onGuardar(nuevaCita);
    limpiarFormulario();
    setGuardada(true);
  }

  const cantidadErrores = Object.keys(errores).length;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-900">Registrar cita nueva</h1>
      <p className="text-sm text-slate-700">
        Usa este formulario para citas que llegan por llamada, WhatsApp o en el local.
      </p>

      {guardada && (
        <div className="flex flex-col items-start gap-2">
          <Mensaje tipo="exito" texto="La cita se guardó con estado Agendado." />
          <Link
            to="/citas"
            className="text-sm font-semibold text-cyan-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
          >
            Ir a la agenda
          </Link>
        </div>
      )}

      {cantidadErrores > 0 && (
        <Mensaje
          tipo="error"
          texto={"El formulario tiene " + cantidadErrores + " campo(s) por corregir."}
        />
      )}

      <form
        onSubmit={manejarEnvio}
        noValidate
        className="grid grid-cols-1 gap-4 rounded-lg border border-slate-300 bg-white p-4 md:grid-cols-2"
      >
        <CampoTexto
          id="cliente"
          etiqueta="Nombre del cliente"
          valor={cliente}
          onCambio={setCliente}
          error={errores.cliente}
        />
        <CampoTexto
          id="vehiculo"
          etiqueta="Vehículo (marca, modelo y año)"
          valor={vehiculo}
          onCambio={setVehiculo}
          error={errores.vehiculo}
        />
        <CampoTexto
          id="telefono"
          etiqueta="Teléfono"
          tipo="tel"
          valor={telefono}
          onCambio={setTelefono}
          error={errores.contacto}
          ayuda="Escribe teléfono o correo. Con uno basta."
        />
        <CampoTexto
          id="correo-cliente"
          etiqueta="Correo del cliente"
          tipo="email"
          valor={correo}
          onCambio={setCorreo}
        />
        <CampoSelect
          id="categoria"
          etiqueta="Categoría del vehículo"
          valor={categoria}
          opciones={categorias}
          onCambio={setCategoria}
          error={errores.categoria}
        />

        <fieldset className="md:col-span-2">
          <legend className="mb-1 text-sm font-medium text-slate-800">Servicios</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {servicios.map((servicio) => (
              <label
                key={servicio.id}
                htmlFor={"servicio-" + servicio.id}
                className="flex items-center gap-2 rounded-md border border-slate-300 p-2 text-sm"
              >
                <input
                  id={"servicio-" + servicio.id}
                  type="checkbox"
                  checked={serviciosElegidos.includes(servicio.id)}
                  onChange={() => marcarServicio(servicio.id)}
                  className="h-4 w-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
                />
                <span>
                  {servicio.nombre} ({servicio.minutos} min, ${servicio.precio})
                </span>
              </label>
            ))}
          </div>
          {errores.servicios && (
            <p className="mt-1 text-sm text-red-800">{errores.servicios}</p>
          )}
        </fieldset>

        <CampoTexto
          id="fecha"
          etiqueta="Fecha"
          tipo="date"
          valor={fecha}
          onCambio={setFecha}
          error={errores.fecha}
        />
        <CampoSelect
          id="hora"
          etiqueta="Horario"
          valor={hora}
          opciones={horarios}
          onCambio={setHora}
          error={errores.hora}
        />

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Boton type="submit">Guardar cita</Boton>
          <Link
            to="/citas"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-700"
          >
            Cancelar y volver a la agenda
          </Link>
        </div>
      </form>
    </div>
  );
}

export default NuevaCita;
