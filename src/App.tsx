import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Cita, EstadoCita } from "./types";
import { citasIniciales } from "./data/citas";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import NuevaCita from "./pages/NuevaCita";
import DetalleCita from "./pages/DetalleCita";

function App() {
  // Estado local: sustituye por ahora a la base de datos y a la API.
  const [sesion, setSesion] = useState(false);
  const [citas, setCitas] = useState<Cita[]>(citasIniciales);

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

  return (
    <Routes>
      <Route path="/" element={<Login onIngresar={() => setSesion(true)} />} />

      <Route element={<Layout sesion={sesion} onSalir={() => setSesion(false)} />}>
        <Route path="/dashboard" element={<Dashboard citas={citas} />} />
        <Route path="/citas" element={<Agenda citas={citas} />} />
        <Route
          path="/citas/nueva"
          element={<NuevaCita citas={citas} onGuardar={agregarCita} />}
        />
        <Route
          path="/citas/:id"
          element={<DetalleCita citas={citas} onCambiarEstado={cambiarEstado} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
