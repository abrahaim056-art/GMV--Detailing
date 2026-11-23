import { ReactNode } from "react";
import Boton from "./Boton";
import Mensaje from "./Mensaje";

export type EstadoCarga = "cargando" | "listo" | "error";

interface ConDatosProps {
  estado: EstadoCarga;
  mensajeError: string;
  onReintentar: () => void;
  children: ReactNode;
}

// Muestra "cargando" o el error de la API; cuando los datos están listos, muestra la página.
function ConDatos({ estado, mensajeError, onReintentar, children }: ConDatosProps) {
  if (estado === "cargando") {
    return (
      <p role="status" className="p-4 text-sm text-gmv-gris">
        Cargando datos...
      </p>
    );
  }

  if (estado === "error") {
    return (
      <div className="flex flex-col items-start gap-3">
        <Mensaje tipo="error" texto={mensajeError} />
        <Boton onClick={onReintentar}>Reintentar</Boton>
      </div>
    );
  }

  return <>{children}</>;
}

export default ConDatos;
