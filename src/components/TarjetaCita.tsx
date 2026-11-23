import { Cita } from "../types";
import { nombresDeCita } from "../data/servicios";
import { formatearFecha } from "../data/citas";
import EtiquetaEstado from "./EtiquetaEstado";
import EnlaceDorado from "./EnlaceDorado";
 
interface TarjetaCitaProps {
  cita: Cita;
  fila?: boolean; // true = se muestra como fila ancha (dashboard)
}
 
interface DatoProps {
  titulo: string;
  valor: string;
}
 
function Dato({ titulo, valor }: DatoProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{titulo}</p>
      <p className="text-sm text-gmv-negro">{valor}</p>
    </div>
  );
}
 
function TarjetaCita({ cita, fila = false }: TarjetaCitaProps) {
  const fechaHora = formatearFecha(cita.fecha) + " · " + cita.hora;
  const servicios = nombresDeCita(cita);
 
  const enlace = (
    <EnlaceDorado
      to={"/citas/" + cita.id}
      etiquetaAccesible={"Ver detalle de la cita de " + cita.cliente}
    >
      {fila ? "Ver detalle" : "Ver detalle de la cita"}
    </EnlaceDorado>
  );
 
  // Fila ancha: nombre, vehículo, fecha, servicio y enlace en una sola línea.
  if (fila) {
    return (
      <article className="grid gap-3 rounded-2xl border border-gmv-borde bg-white p-5 md:grid-cols-[1.3fr_1.2fr_1fr_1.6fr_auto] md:items-center md:gap-5">
        <div>
          <h3 className="mb-2 font-bold text-gmv-negro">{cita.cliente}</h3>
          <EtiquetaEstado estado={cita.estado} />
        </div>
        <Dato titulo="Vehículo" valor={cita.vehiculo} />
        <Dato titulo="Fecha y hora" valor={fechaHora} />
        <Dato titulo="Servicio" valor={servicios} />
        {enlace}
      </article>
    );
  }
 
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-gmv-borde bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gmv-negro">{cita.cliente}</h3>
        <EtiquetaEstado estado={cita.estado} />
      </div>
 
      <p className="text-sm leading-6 text-gmv-gris">
        {cita.vehiculo}
        <br />
        {fechaHora}
        <br />
        {servicios}
      </p>
 
      <div className="mt-1">{enlace}</div>
    </article>
  );
}
 
export default TarjetaCita;