import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EnlaceDoradoProps {
  to: string;
  children: ReactNode;
  // "adelante" = flecha → a la derecha, "atras" = flecha ← a la izquierda
  direccion?: "adelante" | "atras";
  // Texto que leen los lectores de pantalla (opcional)
  etiquetaAccesible?: string;
}

// Enlace con la línea dorada que se mueve al pasar el mouse o tocarlo.
function EnlaceDorado({ to, children, direccion = "adelante", etiquetaAccesible }: EnlaceDoradoProps) {
  const atras = direccion === "atras";

  return (
    <Link
      to={to}
      aria-label={etiquetaAccesible}
      className="group relative inline-flex w-fit items-center gap-2 pb-1 text-sm font-bold text-gmv-negro focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
    >
      {atras && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-x-1 group-active:-translate-x-1"
        >
          ←
        </span>
      )}
      {children}
      {!atras && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
        >
          →
        </span>
      )}
      {/* Línea dorada: empieza a la mitad y se estira al pasar el mouse o tocar */}
      <span
        aria-hidden="true"
        className={
          "absolute bottom-0 h-0.5 w-1/2 bg-gmv-dorado transition-all duration-300 " +
          "group-hover:h-1 group-hover:w-full group-active:w-full group-focus-visible:w-full " +
          (atras ? "right-0" : "left-0")
        }
      />
    </Link>
  );
}

export default EnlaceDorado;