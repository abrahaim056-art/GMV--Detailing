import { Link } from "react-router-dom";
import { Cita } from "../types";
import { obtenerNombresServicios } from "../data/servicios";
import EtiquetaEstado from "./EtiquetaEstado";

interface TarjetaCitaProps {
  cita: Cita;
}

function TarjetaCita({ cita }: TarjetaCitaProps) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-slate-300 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{cita.cliente}</h3>
          <p className="text-sm text-slate-700">{cita.vehiculo}</p>
        </div>
        <EtiquetaEstado estado={cita.estado} />
      </div>

      <p className="text-sm text-slate-700">
        {cita.fecha} a las {cita.hora}
      </p>
      <p className="text-sm text-slate-700">
        {obtenerNombresServicios(cita.serviciosIds)}
      </p>

      <Link
        to={"/citas/" + cita.id}
        aria-label={"Ver detalle de la cita de " + cita.cliente}
        className="mt-2 text-sm font-semibold text-cyan-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
      >
        Ver detalle de la cita
      </Link>
    </article>
  );
}

export default TarjetaCita;
