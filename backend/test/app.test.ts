import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app";
import { obtenerEstadosPermitidos, validarNuevaCita } from "../src/utils/reglasCitas";
import { validarRegistro } from "../src/utils/reglasUsuarios";

describe("API", () => {
  it("responde ok en /api/salud", async () => {
    const respuesta = await request(app).get("/api/salud");
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.estado).toBe("ok");
  });

  it("responde 404 en una ruta que no existe", async () => {
    const respuesta = await request(app).get("/api/no-existe");
    expect(respuesta.status).toBe(404);
  });

  it("pide sesión para ver las citas", async () => {
    const respuesta = await request(app).get("/api/citas");
    expect(respuesta.status).toBe(401);
  });

  it("pide sesión para ver los vehículos", async () => {
    const respuesta = await request(app).get("/api/vehiculos");
    expect(respuesta.status).toBe(401);
  });

  it("rechaza un token falso", async () => {
    process.env.JWT_SECRET = "clave-de-prueba";
    const respuesta = await request(app)
      .get("/api/citas")
      .set("Authorization", "Bearer token-falso");
    expect(respuesta.status).toBe(401);
  });

  it("el inicio de sesión rechaza datos vacíos", async () => {
    const respuesta = await request(app).post("/api/auth/iniciar-sesion").send({});
    expect(respuesta.status).toBe(400);
  });
});

describe("Reglas de negocio", () => {
  it("regla 4: pide teléfono o correo", () => {
    const errores = validarNuevaCita({
      cliente: "Ana",
      telefono: "",
      correo: "",
      vehiculo: "Aveo",
      categoria: "Toyota",
      serviciosIds: ["ejecutivo"],
      fecha: "2026-10-27",
      hora: "10:00",
    });
    expect(errores.length).toBe(1);
  });

  it("regla 3: una cita en proceso no se puede cancelar", () => {
    const permitidos = obtenerEstadosPermitidos("En proceso");
    expect(permitidos.includes("Cancelado")).toBe(false);
  });

  it("el registro exige contraseña de al menos 6 caracteres", () => {
    const errores = validarRegistro({
      nombre: "Ana",
      telefono: "998 111 2233",
      correo: "ana@correo.com",
      contrasena: "123",
    });
    expect(errores.length).toBe(1);
  });
});
