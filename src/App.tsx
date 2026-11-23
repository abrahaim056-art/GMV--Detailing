import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Cita, DatosServicio, EstadoCita, Servicio } from "./types";
import Layout from "./components/Layout";
import ConDatos, { EstadoCarga } from "./components/ConDatos";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import NuevaCita from "./pages/NuevaCita";
import DetalleCita from "./pages/DetalleCita";
import ServicioExtraPagina from "./pages/Servicio_extra";
import { cerrarSesion } from "./services/authApi";
import {
  DatosNuevaCita,
  cambiarEstadoCita,
  crearCita,
  obtenerCitas,
} from "./services/citasApi";
import {
  crearServicio,
  editarServicio,
  obtenerServicios,
  quitarServicio,
} from "./services/serviciosApi";

function App() {
  // Los datos ya no viven aquí: se leen y se guardan en la API (y en MySQL).
  const [sesion, setSesion] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>("cargando");
  const [mensajeError, setMensajeError] = useState("");

  // Carga inicial (y al reintentar): citas y servicios desde la API.
  async function cargarDatos() {
    setEstadoCarga("cargando");
    setMensajeError("");
    try {
      const [citasApi, serviciosApi] = await Promise.all([obtenerCitas(), obtenerServicios()]);
      setCitas(citasApi);
      setServicios(serviciosApi);
      setEstadoCarga("listo");
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(error.message);
      } else {
        setMensajeError("No se pudieron cargar los datos.");
      }
      setEstadoCarga("error");
    }
  }

  useEffect(() => {
    if (sesion) {
      cargarDatos();
    }
  }, [sesion]);

  function salir() {
    cerrarSesion();
    setCitas([]);
    setServicios([]);
    setEstadoCarga("cargando");
    setSesion(false);
  }

  // Las funciones siguientes lanzan el error si la API falla: cada página lo muestra.
  async function cambiarEstado(id: number, nuevoEstado: EstadoCita) {
    const actualizada = await cambiarEstadoCita(id, nuevoEstado);
    setCitas((anteriores) => anteriores.map((cita) => (cita.id === id ? actualizada : cita)));
  }

  async function agregarCita(datos: DatosNuevaCita) {
    await crearCita(datos);
    setCitas(await obtenerCitas()); // se vuelve a leer para ver lo que quedó guardado
  }

  async function agregarServicio(datos: DatosServicio) {
    await crearServicio(datos);
    setServicios(await obtenerServicios());
  }

  async function modificarServicio(id: string, datos: DatosServicio) {
    await editarServicio(id, datos);
    setServicios(await obtenerServicios());
  }

  async function eliminarServicio(id: string) {
    await quitarServicio(id);
    setServicios(await obtenerServicios());
  }

  // Envuelve cada página con los estados de carga y error.
  function conDatos(pagina: JSX.Element) {
    return (
      <ConDatos estado={estadoCarga} mensajeError={mensajeError} onReintentar={cargarDatos}>
        {pagina}
      </ConDatos>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login onIngresar={() => setSesion(true)} />} />

      <Route element={<Layout sesion={sesion} onSalir={salir} />}>
        <Route path="/dashboard" element={conDatos(<Dashboard citas={citas} />)} />
        <Route path="/citas" element={conDatos(<Agenda citas={citas} />)} />
        <Route
          path="/citas/nueva"
          element={conDatos(
            <NuevaCita citas={citas} servicios={servicios} onGuardar={agregarCita} />
          )}
        />
        <Route
          path="/citas/:id"
          element={conDatos(<DetalleCita citas={citas} onCambiarEstado={cambiarEstado} />)}
        />
        <Route
          path="/servicios"
          element={conDatos(
            <ServicioExtraPagina
              servicios={servicios}
              onAgregar={agregarServicio}
              onEditar={modificarServicio}
              onQuitar={eliminarServicio}
            />
          )}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
