interface TarjetaIndicadorProps {
  titulo: string;
  valor: number;
  descripcion: string;
}

function TarjetaIndicador({ titulo, valor, descripcion }: TarjetaIndicadorProps) {
  return (
    <article className="rounded-lg border border-slate-300 bg-white p-4">
      <h3 className="text-sm font-medium text-slate-700">{titulo}</h3>
      <p className="mt-1 text-3xl font-bold text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-600">{descripcion}</p>
    </article>
  );
}

export default TarjetaIndicador;
