import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Cita, EstadoCita, ServicioExtra } from "./types";
import { citasIniciales } from "./data/citas";
import { extrasIniciales } from "./data/extras";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import NuevaCita from "./pages/NuevaCita";
import DetalleCita from "./pages/DetalleCita";
import ServicioExtraPagina from "./pages/Servicio_extra";

function App() {
  // Estado local: sustituye por ahora a la base de datos y a la API.
  const [sesion, setSesion] = useState(false);
  const [citas, setCitas] = useState<Cita[]>(citasIniciales);
  const [extras, setExtras] = useState<ServicioExtra[]>(extrasIniciales);

  function cambiarEstado(id: number, nuevoEstado: EstadoCita) {
    const citasActualizadas = citas.map((cita) => {
      if (cita.id === id) {
        return { ...cita, estado: nuevoEstado };
      }
      return cita;
    });
    setCitas(citasActualizadas);
  }

  function agregarCita(nuevaCita: Cita) {
    setCitas([...citas, nuevaCita]);
  }

  function agregarExtra(nuevoExtra: ServicioExtra) {
    setExtras([...extras, nuevoExtra]);
  }

  function editarExtra(extraEditado: ServicioExtra) {
    setExtras(extras.map((extra) => (extra.id === extraEditado.id ? extraEditado : extra)));
  }

  function quitarExtra(id: string) {
    setExtras(extras.filter((extra) => extra.id !== id));
  }

  return (
    <Routes>
      <Route path="/" element={<Login onIngresar={() => setSesion(true)} />} />

      <Route element={<Layout sesion={sesion} onSalir={() => setSesion(false)} />}>
        <Route path="/dashboard" element={<Dashboard citas={citas} />} />
        <Route path="/citas" element={<Agenda citas={citas} />} />
        <Route
          path="/citas/nueva"
          element={<NuevaCita citas={citas} extras={extras} onGuardar={agregarCita} />}
        />
        <Route
          path="/citas/:id"
          element={<DetalleCita citas={citas} onCambiarEstado={cambiarEstado} />}
        />
        <Route
          path="/servicios"
          element={
            <ServicioExtraPagina
              extras={extras}
              onAgregar={agregarExtra}
              onEditar={editarExtra}
              onQuitar={quitarExtra}
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;