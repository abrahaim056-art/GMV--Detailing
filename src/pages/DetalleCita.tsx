import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Cita, EstadoCita } from "../types";
import { obtenerNombresServicios } from "../data/servicios";
import EtiquetaEstado from "../components/EtiquetaEstado";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface DetalleCitaProps {
  citas: Cita[];
  onCambiarEstado: (id: number, nuevoEstado: EstadoCita) => void;
}

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
  // Guarda el estado que se quiere aplicar mientras se espera la confirmación.
  const [cambioPendiente, setCambioPendiente] = useState<EstadoCita | null>(null);

  const cita = citas.find((item) => item.id === Number(id));

  if (!cita) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Mensaje tipo="error" texto="No encontramos esa cita." />
        <Link
          to="/citas"
          className="text-sm font-semibold text-cyan-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
        >
          Volver a la agenda
        </Link>
      </div>
    );
  }

  const siguientePaso = obtenerSiguientePaso(cita.estado);

  // Regla de negocio 3: solo se puede cancelar o marcar inasistencia antes de recibir el vehículo.
  const puedeCancelar = cita.estado === "Agendado";

  function aplicarCambio(nuevoEstado: EstadoCita) {
    if (!cita) return;
    onCambiarEstado(cita.id, nuevoEstado);
    setMensaje('La cita de ' + cita.cliente + ' ahora está en estado "' + nuevoEstado + '".');
    setCambioPendiente(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/citas"
        className="text-sm font-semibold text-cyan-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
      >
        Volver a la agenda
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Cita de {cita.cliente}</h1>
        <EtiquetaEstado estado={cita.estado} />
      </div>

      {mensaje && <Mensaje tipo="exito" texto={mensaje} />}

      <section
        aria-labelledby="titulo-datos"
        className="rounded-lg border border-slate-300 bg-white p-4"
      >
        <h2 id="titulo-datos" className="mb-3 text-lg font-semibold">
          Datos de la cita
        </h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-700">Fecha y hora</dt>
            <dd>
              {cita.fecha} a las {cita.hora}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Vehículo</dt>
            <dd>
              {cita.vehiculo} ({cita.categoria})
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Servicios</dt>
            <dd>{obtenerNombresServicios(cita.serviciosIds)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Teléfono</dt>
            <dd>{cita.telefono || "No registrado"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Correo</dt>
            <dd>{cita.correo || "No registrado"}</dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="titulo-acciones"
        className="rounded-lg border border-slate-300 bg-white p-4"
      >
        <h2 id="titulo-acciones" className="mb-3 text-lg font-semibold">
          Acciones
        </h2>

        {cambioPendiente === null && (
          <div className="flex flex-wrap gap-2">
            {siguientePaso && (
              <Boton onClick={() => aplicarCambio(siguientePaso.estado)}>
                {siguientePaso.texto}
              </Boton>
            )}
            {puedeCancelar && (
              <>
                <Boton variante="secundario" onClick={() => setCambioPendiente("No se presentó")}>
                  Marcar como no se presentó
                </Boton>
                <Boton variante="peligro" onClick={() => setCambioPendiente("Cancelado")}>
                  Cancelar cita
                </Boton>
              </>
            )}
          </div>
        )}

        {cambioPendiente !== null && (
          <div className="flex flex-col gap-3">
            <p className="text-sm">
              ¿Seguro que quieres cambiar el estado a "{cambioPendiente}"? Esta acción libera el
              horario.
            </p>
            <div className="flex flex-wrap gap-2">
              <Boton variante="peligro" onClick={() => aplicarCambio(cambioPendiente)}>
                Sí, confirmar cambio
              </Boton>
              <Boton variante="secundario" onClick={() => setCambioPendiente(null)}>
                No, volver
              </Boton>
            </div>
          </div>
        )}

        {siguientePaso === null && (
          <p className="text-sm text-slate-700">
            Esta cita ya terminó su recorrido y no tiene más acciones disponibles.
          </p>
        )}

        {!puedeCancelar && siguientePaso !== null && (
          <p className="mt-3 text-xs text-slate-600">
            Esta cita ya está en curso, por eso no se puede cancelar.
          </p>
        )}
      </section>
    </div>
  );
}

export default DetalleCita;
