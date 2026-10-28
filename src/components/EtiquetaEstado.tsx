import { EstadoCita } from "../types";

interface EtiquetaEstadoProps {
  estado: EstadoCita;
}

function EtiquetaEstado({ estado }: EtiquetaEstadoProps) {
  let colores = "";

  switch (estado) {
    case "Agendado":
      colores = "bg-slate-200 text-slate-900";
      break;
    case "Recibido":
      colores = "bg-sky-100 text-sky-900";
      break;
    case "En proceso":
      colores = "bg-amber-100 text-amber-900";
      break;
    case "Terminado":
      colores = "bg-emerald-100 text-emerald-900";
      break;
    case "Entregado":
      colores = "bg-emerald-200 text-emerald-950";
      break;
    case "No se presentó":
      colores = "bg-red-100 text-red-900";
      break;
    case "Cancelado":
      colores = "bg-red-100 text-red-900";
      break;
  }

  return (
    <span
      className={"inline-block rounded-full px-3 py-1 text-xs font-semibold " + colores}
    >
      {estado}
    </span>
  );
}

export default EtiquetaEstado;
