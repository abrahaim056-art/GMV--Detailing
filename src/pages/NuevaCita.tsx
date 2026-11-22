import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Cita, CategoriaVehiculo } from "../types";
import { calcularTotales, marcas, obtenerNombresServicios, servicios } from "../data/servicios";
import { HOY, citaOcupaHorario, formatearFecha, horarios } from "../data/citas";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";
import EnlaceDorado from "../components/EnlaceDorado";
 
interface NuevaCitaProps {
  citas: Cita[];
  onGuardar: (cita: Cita) => void;
}
 
interface Errores {
  cliente?: string;
  contacto?: string;
  modelo?: string;
  marca?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
}
 
function NuevaCita({ citas, onGuardar }: NuevaCitaProps) {
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [servicioElegido, setServicioElegido] = useState("");
  const [fecha, setFecha] = useState(HOY);
  const [hora, setHora] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [guardada, setGuardada] = useState(false);
 
  // Regla de negocio 1: un horario está ocupado si otra cita vigente lo usa ese día.
  function horarioOcupado(horario: string): boolean {
    for (const cita of citas) {
      if (cita.fecha === fecha && cita.hora === horario && citaOcupaHorario(cita)) {
        return true;
      }
    }
    return false;
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
 
    // Regla 2: marca del catálogo y un servicio.
    if (marca === "") {
      nuevosErrores.marca = "Selecciona la marca del vehículo en el catálogo.";
    }
    if (modelo.trim() === "") {
      nuevosErrores.modelo = "Escribe el modelo y el año del vehículo.";
    }
    if (servicioElegido === "") {
      nuevosErrores.servicio = "Selecciona un servicio.";
    }
 
    if (fecha === "") {
      nuevosErrores.fecha = "Selecciona una fecha.";
    }
    if (hora === "") {
      nuevosErrores.hora = "Selecciona un horario.";
    }
 
    // Regla 1: no se puede usar un horario que ya está ocupado.
    if (fecha !== "" && hora !== "" && horarioOcupado(hora)) {
      nuevosErrores.hora = "Ese horario ya está ocupado. Elige otro.";
    }
 
    return nuevosErrores;
  }
 
  function limpiarFormulario() {
    setCliente("");
    setTelefono("");
    setCorreo("");
    setMarca("");
    setModelo("");
    setServicioElegido("");
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
      vehiculo: marca + " " + modelo.trim(),
      categoria: marca as CategoriaVehiculo,
      serviciosIds: [servicioElegido],
      fecha: fecha,
      hora: hora,
      estado: "Agendado",
    };
 
    onGuardar(nuevaCita);
    limpiarFormulario();
    setGuardada(true);
  }
 
  const cantidadErrores = Object.keys(errores).length;
  const totales = calcularTotales(servicioElegido === "" ? [] : [servicioElegido]);
  const textoServicio = servicioElegido === "" ? "—" : obtenerNombresServicios([servicioElegido]);
  const textoVehiculo = marca === "" && modelo.trim() === "" ? "—" : (marca + " " + modelo).trim();
  const textoFecha = hora === "" ? "—" : formatearFecha(fecha) + " · " + hora;
  const textoDuracion = servicioElegido === "" ? "—" : totales.minutos + " min";
 
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Registrar cita nueva</h1>
        <p className="text-gmv-gris">
          Usa este formulario para citas que llegan por llamada, WhatsApp o en el local.
        </p>
      </div>
 
      {guardada && (
        <div className="flex flex-col items-start gap-2">
          <Mensaje tipo="exito" texto="La cita se guardó con estado Agendado." />
          <EnlaceDorado to="/citas">Ir a la agenda</EnlaceDorado>
        </div>
      )}
 
      {cantidadErrores > 0 && (
        <Mensaje
          tipo="error"
          texto={"El formulario tiene " + cantidadErrores + " campo(s) por corregir."}
        />
      )}
 
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
        <form
          onSubmit={manejarEnvio}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-gmv-borde bg-white p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <CampoTexto
              id="cliente"
              etiqueta="Nombre del cliente"
              valor={cliente}
              onCambio={setCliente}
              error={errores.cliente}
            />
            <CampoTexto
              id="telefono"
              etiqueta="Teléfono"
              tipo="tel"
              valor={telefono}
              onCambio={setTelefono}
              error={errores.contacto}
            />
          </div>
 
          <CampoTexto
            id="correo-cliente"
            etiqueta="Correo del cliente"
            tipo="email"
            valor={correo}
            onCambio={setCorreo}
            ayuda="Escribe teléfono o correo. Con uno basta."
          />
 
          {/* Servicio: se elige uno de los 3 tipos */}
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">
              Servicio <span className="font-normal text-gray-500">(elige uno)</span>
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {servicios.map((servicio, indice) => {
                const elegido = servicioElegido === servicio.id;
                const oscuro = indice === servicios.length - 1; // el Ejecutivo es negro
 
                let borde = "border-gmv-borde";
                if (oscuro) borde = "border-gmv-negro";
                if (elegido) borde = "border-gmv-dorado";
 
                return (
                  <label
                    key={servicio.id}
                    htmlFor={"servicio-" + servicio.id}
                    className={
                      "cursor-pointer rounded-2xl border-2 p-4 focus-within:ring-2 focus-within:ring-gmv-dorado " +
                      borde +
                      (oscuro ? " bg-gmv-negro text-white" : " bg-white")
                    }
                  >
                    <input
                      id={"servicio-" + servicio.id}
                      type="radio"
                      name="servicio"
                      checked={elegido}
                      onChange={() => setServicioElegido(servicio.id)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-bold">{servicio.nombre}</span>
                    <span
                      className={
                        "my-2 block min-h-9 text-xs " + (oscuro ? "text-gray-300" : "text-gmv-gris")
                      }
                    >
                      {servicio.descripcion}
                    </span>
                    <span className={"font-extrabold " + (oscuro ? "text-gmv-dorado" : "")}>
                      {servicio.minutos} min · ${servicio.precio}
                    </span>
                  </label>
                );
              })}
            </div>
            {errores.servicio && (
              <p className="mt-1 text-sm font-semibold text-gmv-rojo">{errores.servicio}</p>
            )}
          </fieldset>
 
          {/* Catálogo de vehículos */}
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">Catálogo de vehículos</legend>
            <div className="flex flex-wrap gap-2">
              {marcas.map((nombre) => {
                const elegida = marca === nombre;
                return (
                  <label
                    key={nombre}
                    htmlFor={"marca-" + nombre}
                    className={
                      "cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-gmv-dorado " +
                      (elegida
                        ? "border-gmv-dorado bg-gmv-dorado font-bold"
                        : "border-gray-300 bg-white")
                    }
                  >
                    <input
                      id={"marca-" + nombre}
                      type="radio"
                      name="marca"
                      checked={elegida}
                      onChange={() => setMarca(nombre)}
                      className="sr-only"
                    />
                    {nombre}
                  </label>
                );
              })}
            </div>
            {errores.marca && (
              <p className="mt-1 text-sm font-semibold text-gmv-rojo">{errores.marca}</p>
            )}
          </fieldset>
 
          <CampoTexto
            id="modelo"
            etiqueta="Modelo y año"
            valor={modelo}
            onCambio={setModelo}
            error={errores.modelo}
            marcador="Hilux 2019"
          />
 
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr]">
            <CampoTexto
              id="fecha"
              etiqueta="Fecha"
              tipo="date"
              valor={fecha}
              onCambio={setFecha}
              error={errores.fecha}
            />
 
            <fieldset>
              <legend className="mb-1.5 text-sm font-semibold">Horario</legend>
              <div className="flex flex-wrap gap-2">
                {horarios.map((horario) => {
                  const ocupado = horarioOcupado(horario);
                  const elegido = hora === horario;
 
                  let colores = "cursor-pointer border-gray-300 bg-white";
                  if (elegido) colores = "cursor-pointer border-gmv-dorado bg-gmv-dorado font-bold";
                  if (ocupado)
                    colores = "cursor-not-allowed border-dashed border-gray-300 bg-gray-100 text-gray-400";
 
                  return (
                    <label
                      key={horario}
                      htmlFor={"hora-" + horario}
                      className={
                        "rounded-full border-[1.5px] px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-gmv-dorado " +
                        colores
                      }
                    >
                      <input
                        id={"hora-" + horario}
                        type="radio"
                        name="hora"
                        checked={elegido}
                        disabled={ocupado}
                        onChange={() => setHora(horario)}
                        className="sr-only"
                      />
                      {horario}
                      {ocupado && " · Ocupado"}
                    </label>
                  );
                })}
              </div>
              {errores.hora && (
                <p className="mt-1 text-sm font-semibold text-gmv-rojo">{errores.hora}</p>
              )}
            </fieldset>
          </div>
 
          <div className="flex flex-wrap gap-3">
            <Boton type="submit">Guardar cita</Boton>
            <Link
              to="/citas"
              className="rounded-xl border-2 border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gmv-negro hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gmv-dorado"
            >
              Cancelar y volver a la agenda
            </Link>
          </div>
        </form>
 
        {/* Resumen de la cita (tarjeta negra) */}
        <aside aria-label="Resumen de la cita" className="rounded-2xl bg-gmv-negro p-6 text-white">
          <h2 className="mb-3 font-bold text-gmv-dorado">Resumen de la cita</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div>
              <dt className="text-gray-400">Servicio</dt>
              <dd className="font-bold">{textoServicio}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Vehículo</dt>
              <dd className="font-bold">{textoVehiculo}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Fecha y hora</dt>
              <dd className="font-bold">{textoFecha}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Duración</dt>
              <dd className="font-bold">{textoDuracion}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-gray-700 pt-4">
            <span className="text-gray-400">Total</span>
            <span className="text-3xl font-extrabold text-gmv-dorado">${totales.precio}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
 
export default NuevaCita;