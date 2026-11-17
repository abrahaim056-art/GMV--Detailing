import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cita } from "../types";
import TarjetaCita from "../components/TarjetaCita";
import Boton from "../components/Boton";
 
interface AgendaProps {
  citas: Cita[];
}
 
const opcionesEstado: string[] = [
  "Todos",
  "Agendado",
  "Recibido",
  "En proceso",
  "Terminado",
  "Entregado",
  "No se presentó",
  "Cancelado",
];
 
function Agenda({ citas }: AgendaProps) {
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
 
  // Carga simulada: en el futuro aquí se llamará a la API.
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setCargando(false);
    }, 800);
 
    return () => clearTimeout(temporizador);
  }, []);
 
  const citasFiltradas = citas.filter((cita) => {
    const coincideEstado = filtroEstado === "Todos" || cita.estado === filtroEstado;
    const coincideNombre = cita.cliente.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideNombre;
  });
 
  function limpiarFiltros() {
    setFiltroEstado("Todos");
    setBusqueda("");
  }
 
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold text-gmv-negro">Agenda de citas</h1>
        <Link
          to="/citas/nueva"
          className="rounded-xl bg-gmv-dorado px-5 py-3 text-sm font-bold text-gmv-negro hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gmv-dorado"
        >
          Registrar cita nueva
        </Link>
      </div>
 
      <form
        className="grid grid-cols-1 gap-4 rounded-2xl border border-gmv-borde bg-white p-5 sm:grid-cols-[1.6fr_1fr]"
        onSubmit={(evento) => evento.preventDefault()}
      >
        <div>
          <label htmlFor="busqueda" className="mb-1.5 block text-sm font-semibold">
            Buscar por nombre del cliente
          </label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            className="h-12 w-full rounded-lg border-[1.5px] border-gray-300 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
          />
        </div>
        <div>
          <label htmlFor="filtro-estado" className="mb-1.5 block text-sm font-semibold">
            Filtrar por estado
          </label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            className="h-12 w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gmv-dorado"
          >
            {opcionesEstado.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </form>
 
      {cargando && (
        <p role="status" className="p-4 text-sm text-gmv-gris">
          Cargando citas...
        </p>
      )}
 
      {!cargando && citasFiltradas.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-gray-400 p-4">
          <p className="text-sm text-gmv-gris">
            No hay citas que coincidan con tu búsqueda.
          </p>
          <Boton variante="secundario" onClick={limpiarFiltros}>
            Limpiar filtros
          </Boton>
        </div>
      )}
 
      {!cargando && citasFiltradas.length > 0 && (
        <>
          <p className="text-sm text-gmv-gris" aria-live="polite">
            Mostrando {citasFiltradas.length} de {citas.length} citas.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {citasFiltradas.map((cita) => (
              <TarjetaCita key={cita.id} cita={cita} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
 
export default Agenda;