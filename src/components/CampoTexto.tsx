interface CampoTextoProps {
  id: string;
  etiqueta: string;
  tipo?: string;
  valor: string;
  onCambio: (valor: string) => void;
  error?: string;
  ayuda?: string;
}

function CampoTexto({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onCambio,
  error,
  ayuda,
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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
        {etiqueta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : false}
        aria-describedby={describedBy || undefined}
        className="w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
      />
      {ayuda && !error && (
        <p id={idAyuda} className="mt-1 text-xs text-slate-600">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="mt-1 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

export default CampoTexto;
