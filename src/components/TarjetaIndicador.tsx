interface TarjetaIndicadorProps {
  titulo: string;
  valor: number;
  descripcion: string;
  oscura?: boolean;
}
 
// La tarjeta "oscura" es negra con el número en dorado (la primera del dashboard).
function TarjetaIndicador({ titulo, valor, descripcion, oscura = false }: TarjetaIndicadorProps) {
  let tarjeta = "rounded-2xl border border-gmv-borde bg-white p-5";
  let colorTitulo = "text-gmv-gris";
  let colorValor = "text-gmv-negro";
  let colorTexto = "text-gray-500";
 
  if (oscura) {
    tarjeta = "rounded-2xl border border-gmv-negro bg-gmv-negro p-5";
    colorTitulo = "text-gray-200";
    colorValor = "text-gmv-dorado";
    colorTexto = "text-gray-400";
  }
 
  return (
    <article className={tarjeta}>
      <h3 className={"text-sm font-semibold " + colorTitulo}>{titulo}</h3>
      <p className={"my-1 text-5xl font-extrabold " + colorValor}>{valor}</p>
      <p className={"text-xs " + colorTexto}>{descripcion}</p>
    </article>
  );
}
 
export default TarjetaIndicador;