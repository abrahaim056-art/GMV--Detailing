import { ReactNode } from "react";
 
interface BotonProps {
  children: ReactNode;
  variante?: "principal" | "secundario" | "peligro" | "contornoPeligro";
  type?: "button" | "submit";
  disabled?: boolean;
  anchoCompleto?: boolean;
  onClick?: () => void;
}
 
function Boton({
  children,
  variante = "principal",
  type = "button",
  disabled = false,
  anchoCompleto = false,
  onClick,
}: BotonProps) {
  const base =
    "rounded-xl px-5 py-3 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gmv-dorado disabled:cursor-not-allowed disabled:opacity-60";
 
  let colores = "";
  if (variante === "principal") {
    colores = "bg-gmv-dorado text-gmv-negro hover:brightness-95";
  } else if (variante === "secundario") {
    colores = "border-2 border-gray-300 bg-white text-gmv-negro hover:bg-gray-50";
  } else if (variante === "contornoPeligro") {
    colores = "border-2 border-gmv-rojo bg-white text-gmv-rojo hover:bg-gmv-rosa";
  } else {
    colores = "bg-gmv-rojo text-white hover:brightness-90";
  }
 
  let ancho = "";
  if (anchoCompleto) {
    ancho = " w-full";
  }
 
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={base + " " + colores + ancho}
    >
      {children}
    </button>
  );
}
 
export default Boton;