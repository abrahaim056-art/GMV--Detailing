interface MensajeProps {
  tipo: "exito" | "error" | "info";
  texto: string;
}
 
// Mensaje que los lectores de pantalla anuncian cuando aparece (aria-live).
function Mensaje({ tipo, texto }: MensajeProps) {
  let colores = "";
  if (tipo === "exito") {
    colores = "border-gmv-dorado bg-gmv-crema text-gmv-negro";
  } else if (tipo === "error") {
    colores = "border-gmv-rojo bg-gmv-rosa text-gmv-rojo";
  } else {
    colores = "border-gmv-gris bg-gray-100 text-gmv-negro";
  }
 
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      aria-live={tipo === "error" ? "assertive" : "polite"}
      className={"rounded-lg border-l-4 p-3 text-sm font-semibold " + colores}
    >
      {texto}
    </div>
  );
}
 
export default Mensaje;