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
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gmv-negro">
        {etiqueta}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : false}
        aria-describedby={error ? idError : undefined}
        className="h-12 w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
      >
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {error && (
        <p id={idError} className="mt-1 text-sm font-semibold text-gmv-rojo">
          {error}
        </p>
      )}
    </div>
  );
}
 
export default CampoSelect;