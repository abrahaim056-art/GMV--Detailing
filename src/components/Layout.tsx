import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";

interface LayoutProps {
  sesion: boolean;
  onSalir: () => void;
}

// Encabezado + navegación + contenido de las páginas internas.
// Si no hay sesión iniciada, se regresa al inicio de sesión.
function Layout({ sesion, onSalir }: LayoutProps) {
  const navigate = useNavigate();

  if (!sesion) {
    return <Navigate to="/" replace />;
  }

  function cerrarSesion() {
    onSalir();
    navigate("/");
  }

  function claseEnlace(activo: boolean) {
    const base =
      "rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white";
    if (activo) {
      return base + " bg-cyan-700 text-white";
    }
    return base + " text-slate-200 hover:bg-slate-700";
  }

  return (
    <div className="min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-white focus:p-2"
      >
        Saltar al contenido
      </a>

      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <Link
            to="/dashboard"
            className="text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            GMV Detailing Services
          </Link>

          <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-2">
            <NavLink to="/dashboard" className={({ isActive }) => claseEnlace(isActive)}>
              Dashboard
            </NavLink>
            <NavLink to="/citas" end className={({ isActive }) => claseEnlace(isActive)}>
              Agenda
            </NavLink>
            <NavLink to="/citas/nueva" className={({ isActive }) => claseEnlace(isActive)}>
              Nueva cita
            </NavLink>
            <button
              type="button"
              onClick={cerrarSesion}
              className="rounded-md border border-slate-500 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      <main id="contenido" className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
