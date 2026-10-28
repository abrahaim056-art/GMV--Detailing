import { ReactNode } from "react";

interface BotonProps {
  children: ReactNode;
  variante?: "principal" | "secundario" | "peligro";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

function Boton({
  children,
  variante = "principal",
  type = "button",
  disabled = false,
  onClick,
}: BotonProps) {
  const base =
    "rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-700 disabled:cursor-not-allowed disabled:opacity-60";

  let colores = "";
  if (variante === "principal") {
    colores = "bg-cyan-700 text-white hover:bg-cyan-800";
  } else if (variante === "secundario") {
    colores = "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100";
  } else {
    colores = "bg-red-700 text-white hover:bg-red-800";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={base + " " + colores}
    >
      {children}
    </button>
  );
}

export default Boton;
