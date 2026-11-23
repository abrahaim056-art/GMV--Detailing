import { useState } from "react";
import { useParams } from "react-router-dom";
import { Cita, EstadoCita } from "../types";
import { formatearFecha } from "../data/citas";
import EtiquetaEstado from "../components/EtiquetaEstado";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";
import EnlaceDorado from "../components/EnlaceDorado";
 
interface DetalleCitaProps {
  citas: Cita[];
  onCambiarEstado: (id: number, nuevoEstado: EstadoCita) => Promise<void>;
}
 
// Pasos normales del flujo (los mismos de la app móvil).
const pasosDelFlujo: EstadoCita[] = ["Agendado", "Recibido", "En proceso", "Terminado", "Entregado"];
 
// Devuelve el siguiente paso normal del flujo para cada estado.
function obtenerSiguientePaso(estado: EstadoCita): { estado: EstadoCita; texto: string } | null {
  switch (estado) {
    case "Agendado":
      return { estado: "Recibido", texto: "Marcar vehículo como recibido" };
    case "Recibido":
      return { estado: "En proceso", texto: "Iniciar lavado" };
    case "En proceso":
      return { estado: "Terminado", texto: "Marcar servicio como terminado" };
    case "Terminado":
      return { estado: "Entregado", texto: "Cobrar y entregar vehículo" };
    default:
      return null;
  }
}

 
function DetalleCita({ citas, onCambiarEstado }: DetalleCitaProps) {
  const { id } = useParams();
  const [mensaje, setMensaje] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [guardando, setGuardando] = useState(false);
  // Guarda el estado que se quiere aplicar mientras se espera la confirmación.
  const [cambioPendiente, setCambioPendiente] = useState<EstadoCita | null>(null);
 
  const cita = citas.find((item) => item.id === Number(id));
 
  if (!cita) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Mensaje tipo="error" texto="No encontramos esa cita." />
        <EnlaceDorado to="/citas" direccion="atras">
          Volver a la agenda
        </EnlaceDorado>
      </div>
    );
  }
 
  const siguientePaso = obtenerSiguientePaso(cita.estado);
  const pasoActual = pasosDelFlujo.indexOf(cita.estado); // -1 si no sigue el flujo normal
 
  // Regla de negocio 3: solo se puede cancelar o marcar inasistencia antes de recibir el vehículo.
  const puedeCancelar = cita.estado === "Agendado";
 
  // Cambia el estado en la API. El mensaje de éxito solo sale si la API respondió bien.
  async function aplicarCambio(nuevoEstado: EstadoCita) {
    if (!cita) return;
    setMensaje("");
    setErrorApi("");
    setGuardando(true);
    try {
      await onCambiarEstado(cita.id, nuevoEstado);
      setMensaje('La cita de ' + cita.cliente + ' ahora está en estado "' + nuevoEstado + '".');
    } catch (error) {
      if (error instanceof Error) {
        setErrorApi(error.message);
      } else {
        setErrorApi("No se pudo cambiar el estado.");
      }
    }
    setCambioPendiente(null);
    setGuardando(false);
  }
 
  return (
    <div className="flex flex-col gap-4">
      <EnlaceDorado to="/citas" direccion="atras">
        Volver a la agenda
      </EnlaceDorado>
 
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold text-gmv-negro">Cita de {cita.cliente}</h1>
        <EtiquetaEstado estado={cita.estado} />
      </div>
 
      {mensaje && <Mensaje tipo="exito" texto={mensaje} />}
      {errorApi && <Mensaje tipo="error" texto={errorApi} />}
 
      <div className="grid items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col gap-5">
          <section
            aria-labelledby="titulo-datos"
            className="rounded-2xl border border-gmv-borde bg-white p-5"
          >
            <h2 id="titulo-datos" className="mb-4 text-lg font-bold">
              Datos de la cita
            </h2>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-gray-500">Fecha y hora</dt>
                <dd className="font-medium">
                  {formatearFecha(cita.fecha)} {cita.fecha.slice(0, 4)} · {cita.hora}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Vehículo</dt>
                <dd className="font-medium">{cita.vehiculo}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-gray-500">Servicios</dt>
                <dd className="font-medium">
                  <ul className="flex flex-col gap-1">
                    {cita.servicios.map((servicio) => (
                      <li key={servicio.id} className="flex justify-between gap-4">
                        <span>{servicio.nombre}</span>
                        <span>
                          ${servicio.precio} · {servicio.minutos} min
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 border-t border-gmv-borde pt-2 font-bold">
                    Total: ${cita.total} · aprox. {cita.minutos} min
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Teléfono</dt>
                <dd className="font-medium">{cita.telefono || "No registrado"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">Correo</dt>
                <dd className="font-medium">{cita.correo || "No registrado"}</dd>
              </div>
            </dl>
          </section>
 
          <section
            aria-labelledby="titulo-seguimiento"
            className="rounded-2xl border border-gmv-borde bg-white p-5"
          >
            <h2 id="titulo-seguimiento" className="mb-5 text-lg font-bold">
              Seguimiento
            </h2>
 
            {pasoActual === -1 ? (
              <p className="text-sm font-semibold text-gmv-rojo">
                Esta cita terminó con el estado: {cita.estado}.
              </p>
            ) : (
              <ol className="flex">
                {pasosDelFlujo.map((paso, indice) => {
                  const completado = indice <= pasoActual;
                  return (
                    <li key={paso} className="flex-1 text-center">
                      <div
                        className={
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-full border-[3px] text-sm font-bold " +
                          (completado
                            ? "border-gmv-dorado bg-gmv-dorado"
                            : "border-gray-300 bg-white")
                        }
                      >
                        {completado ? "✓" : ""}
                      </div>
                      <p
                        className={
                          "mt-2 text-xs sm:text-sm " +
                          (indice === pasoActual ? "font-bold" : "text-gray-500")
                        }
                      >
                        {paso}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
 
        <section
          aria-labelledby="titulo-acciones"
          className="rounded-2xl border border-gmv-borde bg-white p-5"
        >
          <h2 id="titulo-acciones" className="mb-4 text-lg font-bold">
            Acciones
          </h2>
 
          {cambioPendiente === null && (
            <div className="flex flex-col gap-3">
              {siguientePaso && (
                <Boton
                  anchoCompleto
                  disabled={guardando}
                  onClick={() => aplicarCambio(siguientePaso.estado)}
                >
                  {siguientePaso.texto}
                </Boton>
              )}
              {puedeCancelar && (
                <>
                  <Boton
                    variante="secundario"
                    anchoCompleto
                    disabled={guardando}
                    onClick={() => setCambioPendiente("No se presentó")}
                  >
                    Marcar como no se presentó
                  </Boton>
                  <Boton
                    variante="contornoPeligro"
                    anchoCompleto
                    disabled={guardando}
                    onClick={() => setCambioPendiente("Cancelado")}
                  >
                    Cancelar cita
                  </Boton>
                </>
              )}
            </div>
          )}
 
          {cambioPendiente !== null && (
            <div
              role="alertdialog"
              aria-label="Confirmar cambio de estado"
              className="flex flex-col gap-3 rounded-xl border-[1.5px] border-dashed border-gmv-rojo bg-gmv-rosa p-4"
            >
              <p className="text-sm font-semibold">
                {cambioPendiente === "Cancelado"
                  ? "¿Cancelar esta cita?"
                  : "¿Marcar esta cita como no se presentó?"}{" "}
                Esta acción libera el horario.
              </p>
              <div className="flex flex-wrap gap-2">
                <Boton
                  variante="peligro"
                  disabled={guardando}
                  onClick={() => aplicarCambio(cambioPendiente)}
                >
                  Sí, confirmar
                </Boton>
                <Boton variante="secundario" onClick={() => setCambioPendiente(null)}>
                  Volver
                </Boton>
              </div>
            </div>
          )}
 
          {siguientePaso === null && (
            <p className="text-sm text-gmv-gris">
              Esta cita ya terminó su recorrido y no tiene más acciones disponibles.
            </p>
          )}
 
          {!puedeCancelar && siguientePaso !== null && (
            <p className="mt-3 text-xs text-gray-500">
              Esta cita ya está en curso, por eso no se puede cancelar.
            </p>
          )}
 
          {puedeCancelar && cambioPendiente === null && (
            <p className="mt-3 text-xs text-gray-500">
              Solo se puede cancelar mientras la cita esté en estado Agendado.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
 
export default DetalleCita;