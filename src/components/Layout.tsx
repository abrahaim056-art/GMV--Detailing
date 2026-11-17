import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo";
 
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
      "rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white";
    if (activo) {
      return base + " bg-gmv-dorado font-bold text-gmv-negro";
    }
    return base + " text-gray-300 hover:text-white";
  }
 
  return (
    <div className="min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-white focus:p-2"
      >
        Saltar al contenido
      </a>
 
      <header className="bg-gmv-negro text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Logo />
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
              className="rounded-xl border border-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>
 
      <main id="contenido" className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
 
export default Layout;