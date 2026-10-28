interface MensajeProps {
  tipo: "exito" | "error" | "info";
  texto: string;
}

// Mensaje que los lectores de pantalla anuncian cuando aparece (aria-live).
function Mensaje({ tipo, texto }: MensajeProps) {
  let colores = "";
  if (tipo === "exito") {
    colores = "border-emerald-700 bg-emerald-50 text-emerald-900";
  } else if (tipo === "error") {
    colores = "border-red-700 bg-red-50 text-red-900";
  } else {
    colores = "border-sky-700 bg-sky-50 text-sky-900";
  }

  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      aria-live={tipo === "error" ? "assertive" : "polite"}
      className={"rounded-md border-l-4 p-3 text-sm " + colores}
    >
      {texto}
    </div>
  );
}

export default Mensaje;
