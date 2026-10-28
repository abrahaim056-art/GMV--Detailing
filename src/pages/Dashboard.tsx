import { Link } from "react-router-dom";
import { Cita } from "../types";
import { HOY } from "../data/citas";
import TarjetaIndicador from "../components/TarjetaIndicador";
import TarjetaCita from "../components/TarjetaCita";

interface DashboardProps {
  citas: Cita[];
}

function Dashboard({ citas }: DashboardProps) {
  const citasHoy = citas.filter((cita) => cita.fecha === HOY);
  const enProceso = citas.filter((cita) => cita.estado === "En proceso");
  const porEntregar = citas.filter((cita) => cita.estado === "Terminado");
  const noPresentadas = citas.filter((cita) => cita.estado === "No se presentó");

  // Citas de hoy que todavía requieren atención del encargado.
  const pendientesHoy = citasHoy.filter((cita) => {
    if (cita.estado === "Entregado") return false;
    if (cita.estado === "Cancelado") return false;
    if (cita.estado === "No se presentó") return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-700">Resumen del día {HOY}.</p>
      </div>

      <section aria-labelledby="titulo-indicadores">
        <h2 id="titulo-indicadores" className="mb-3 text-lg font-semibold">
          Indicadores
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TarjetaIndicador
            titulo="Citas de hoy"
            valor={citasHoy.length}
            descripcion="Todas las citas con fecha de hoy"
          />
          <TarjetaIndicador
            titulo="En proceso"
            valor={enProceso.length}
            descripcion="Vehículos que se están lavando"
          />
          <TarjetaIndicador
            titulo="Por entregar"
            valor={porEntregar.length}
            descripcion="Terminados, esperando cobro y entrega"
          />
          <TarjetaIndicador
            titulo="No se presentaron"
            valor={noPresentadas.length}
            descripcion="Turnos perdidos"
          />
        </div>
      </section>

      <section aria-labelledby="titulo-pendientes">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="titulo-pendientes" className="text-lg font-semibold">
            Pendientes de hoy
          </h2>
          <Link
            to="/citas"
            className="text-sm font-semibold text-cyan-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
          >
            Ver toda la agenda
          </Link>
        </div>

        {pendientesHoy.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-400 p-4 text-sm text-slate-700">
            No hay citas pendientes hoy. Puedes registrar una cita nueva desde el menú.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {pendientesHoy.map((cita) => (
              <TarjetaCita key={cita.id} cita={cita} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
