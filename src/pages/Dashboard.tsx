import { Cita } from "../types";
import { HOY, HOY_TEXTO } from "../data/citas";
import TarjetaIndicador from "../components/TarjetaIndicador";
import TarjetaCita from "../components/TarjetaCita";
import EnlaceDorado from "../components/EnlaceDorado";
 
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
 
  // En el dashboard solo se muestran las 3 primeras; el resto está en la agenda.
  const primerasPendientes = pendientesHoy.slice(0, 3);
 
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gmv-negro">Dashboard</h1>
        <p className="text-gmv-gris">Resumen del día {HOY_TEXTO}</p>
      </div>
 
      <section aria-labelledby="titulo-indicadores">
        <h2 id="titulo-indicadores" className="mb-3 text-lg font-bold">
          Indicadores
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TarjetaIndicador
            titulo="Citas de hoy"
            valor={citasHoy.length}
            descripcion="Citas programadas"
            oscura
          />
          <TarjetaIndicador
            titulo="En proceso"
            valor={enProceso.length}
            descripcion="Vehículos en servicio"
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
          <h2 id="titulo-pendientes" className="text-lg font-bold">
            Pendientes de hoy
          </h2>
          <EnlaceDorado to="/citas">Ver toda la agenda</EnlaceDorado>
        </div>
 
        {primerasPendientes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-400 p-4 text-sm text-gmv-gris">
            No hay citas pendientes hoy. Puedes registrar una cita nueva desde el menú.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {primerasPendientes.map((cita) => (
              <TarjetaCita key={cita.id} cita={cita} fila />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
 
export default Dashboard;