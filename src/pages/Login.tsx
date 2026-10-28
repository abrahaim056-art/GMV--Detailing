import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../components/CampoTexto";
import Boton from "../components/Boton";
import Mensaje from "../components/Mensaje";

interface LoginProps {
  onIngresar: () => void;
}

// Credenciales de demostración. No hay autenticación real en esta entrega.
const CORREO_DEMO = "admin@gmv.com";
const CONTRASENA_DEMO = "1234";

function Login({ onIngresar }: LoginProps) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorCorreo("");
    setErrorContrasena("");
    setErrorGeneral("");

    let hayErrores = false;

    if (correo.trim() === "") {
      setErrorCorreo("Escribe tu correo.");
      hayErrores = true;
    }
    if (contrasena.trim() === "") {
      setErrorContrasena("Escribe tu contraseña.");
      hayErrores = true;
    }
    if (hayErrores) {
      return;
    }

    // Se simula una espera de red de menos de un segundo.
    setCargando(true);
    setTimeout(() => {
      setCargando(false);

      if (correo === CORREO_DEMO && contrasena === CONTRASENA_DEMO) {
        onIngresar();
        navigate("/dashboard");
      } else {
        setErrorGeneral("El correo o la contraseña no son correctos.");
      }
    }, 700);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-300 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">GMV Detailing Services</h1>
        <p className="mb-4 mt-1 text-sm text-slate-700">
          Panel para el encargado del negocio.
        </p>

        <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
          <CampoTexto
            id="correo"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={correo}
            onCambio={setCorreo}
            error={errorCorreo}
          />
          <CampoTexto
            id="contrasena"
            etiqueta="Contraseña"
            tipo="password"
            valor={contrasena}
            onCambio={setContrasena}
            error={errorContrasena}
          />

          {errorGeneral && <Mensaje tipo="error" texto={errorGeneral} />}

          <Boton type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar al panel"}
          </Boton>
        </form>

        <p className="mt-4 text-xs text-slate-600">
          Datos de prueba: {CORREO_DEMO} / {CONTRASENA_DEMO}
        </p>
      </div>
    </main>
  );
}

export default Login;
