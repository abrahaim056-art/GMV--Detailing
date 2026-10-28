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
        <h1 className="text-2xl font-bold text-slate-900">Agenda de citas</h1>
        <Link
          to="/citas/nueva"
          className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-700"
        >
          Registrar cita nueva
        </Link>
      </div>

      <form
        className="grid grid-cols-1 gap-3 rounded-lg border border-slate-300 bg-white p-4 sm:grid-cols-2"
        onSubmit={(evento) => evento.preventDefault()}
      >
        <div>
          <label htmlFor="busqueda" className="mb-1 block text-sm font-medium">
            Buscar por nombre del cliente
          </label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            className="w-full rounded-md border border-slate-400 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
          />
        </div>
        <div>
          <label htmlFor="filtro-estado" className="mb-1 block text-sm font-medium">
            Filtrar por estado
          </label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            className="w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
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
        <p role="status" className="p-4 text-sm text-slate-700">
          Cargando citas...
        </p>
      )}

      {!cargando && citasFiltradas.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-slate-400 p-4">
          <p className="text-sm text-slate-700">
            No hay citas que coincidan con tu búsqueda.
          </p>
          <Boton variante="secundario" onClick={limpiarFiltros}>
            Limpiar filtros
          </Boton>
        </div>
      )}

      {!cargando && citasFiltradas.length > 0 && (
        <>
          <p className="text-sm text-slate-700" aria-live="polite">
            Mostrando {citasFiltradas.length} de {citas.length} citas.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
