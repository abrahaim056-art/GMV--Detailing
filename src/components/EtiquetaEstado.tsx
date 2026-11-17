import { EstadoCita } from "../types";
 
interface EtiquetaEstadoProps {
  estado: EstadoCita;
}
 
// Los colores son los mismos de la app móvil.
function EtiquetaEstado({ estado }: EtiquetaEstadoProps) {
  let colores = "";
 
  switch (estado) {
    case "Agendado":
      colores = "bg-gray-200 text-gmv-gris";
      break;
    case "Recibido":
      colores = "bg-gmv-gris text-white";
      break;
    case "En proceso":
      colores = "bg-gmv-dorado text-gmv-negro";
      break;
    case "Terminado":
      colores = "border border-gmv-dorado bg-white text-gmv-negro";
      break;
    case "Entregado":
      colores = "bg-gmv-negro text-gmv-dorado";
      break;
    case "No se presentó":
      colores = "bg-gmv-rosa text-gmv-rojo";
      break;
    case "Cancelado":
      colores = "bg-gmv-rosa text-gmv-rojo";
      break;
  }
 
  return (
    <span
      className={"inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold " + colores}
    >
      {estado}
    </span>
  );
}
 
export default EtiquetaEstado;