interface CampoSelectProps {
  id: string;
  etiqueta: string;
  valor: string;
  opciones: string[];
  onCambio: (valor: string) => void;
  error?: string;
}

function CampoSelect({ id, etiqueta, valor, opciones, onCambio, error }: CampoSelectProps) {
  const idError = id + "-error";

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
        {etiqueta}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : false}
        aria-describedby={error ? idError : undefined}
        className="w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
      >
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {error && (
        <p id={idError} className="mt-1 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

export default CampoSelect;
