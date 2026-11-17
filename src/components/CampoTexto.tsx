interface CampoTextoProps {
  id: string;
  etiqueta: string;
  tipo?: string;
  valor: string;
  onCambio: (valor: string) => void;
  error?: string;
  ayuda?: string;
  marcador?: string;
}
 
function CampoTexto({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onCambio,
  error,
  ayuda,
  marcador,
}: CampoTextoProps) {
  const idError = id + "-error";
  const idAyuda = id + "-ayuda";
 
  // Se enlazan los textos de apoyo con el campo para lectores de pantalla.
  let describedBy = "";
  if (ayuda) {
    describedBy = idAyuda;
  }
  if (error) {
    describedBy = idError;
  }
 
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gmv-negro">
        {etiqueta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        placeholder={marcador}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : false}
        aria-describedby={describedBy || undefined}
        className="h-12 w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
      />
      {ayuda && !error && (
        <p id={idAyuda} className="mt-1 text-xs text-gmv-gris">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="mt-1 text-sm font-semibold text-gmv-rojo">
          {error}
        </p>
      )}
    </div>
  );
}
 
export default CampoTexto;