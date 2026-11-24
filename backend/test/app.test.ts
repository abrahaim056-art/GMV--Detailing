import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app";
import { obtenerEstadosPermitidos, validarNuevaCita } from "../src/utils/reglasCitas";
import { validarRegistro } from "../src/utils/reglasUsuarios";
import { validarServicio } from "../src/utils/reglasServicios";
import { crearToken } from "../src/utils/token";
import { validarCliente } from "../src/utils/reglasClientes";

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

describe("Servicios", () => {
  it("crear un servicio pide sesión", async () => {
    const respuesta = await request(app).post("/api/servicios").send({});
    expect(respuesta.status).toBe(401);
  });

  it("un cliente no puede crear servicios (403)", async () => {
    process.env.JWT_SECRET = "clave-de-prueba";
    const token = crearToken({ id: 1, rol: "cliente" });
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "Aspirado", precio: 100, minutos: 20 });
    expect(respuesta.status).toBe(403);
  });

  it("el encargado recibe 400 si faltan datos", async () => {
    process.env.JWT_SECRET = "clave-de-prueba";
    const token = crearToken({ id: 1, rol: "encargado" });
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "", precio: -5 });
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.errores.length).toBeGreaterThan(0);
  });

  it("un JSON mal escrito responde 400 y no 500", async () => {
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Content-Type", "application/json")
      .send("{esto no es json");
    expect(respuesta.status).toBe(400);
  });

  it("validarServicio acepta un servicio correcto", () => {
    const errores = validarServicio({ nombre: "Aspirado", precio: 100, minutos: 20, tipo: "extra" });
    expect(errores.length).toBe(0);
  });

  it("validarServicio rechaza precio, tiempo y tipo inválidos", () => {
    const errores = validarServicio({ nombre: "Aspirado", precio: 0, minutos: 2.5, tipo: "otro" });
    expect(errores.length).toBe(3);
  });
  
describe("Clientes", () => {
  it("ver los clientes pide sesión", async () => {
    const respuesta = await request(app).get("/api/clientes");
    expect(respuesta.status).toBe(401);
  });

  it("un cliente no puede registrar clientes (403)", async () => {
    process.env.JWT_SECRET = "clave-de-prueba";
    const token = crearToken({ id: 1, rol: "cliente" });
    const respuesta = await request(app)
      .post("/api/clientes")
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "Ana", telefono: "998 111 2233" });
    expect(respuesta.status).toBe(403);
  });

  it("el encargado recibe 400 si faltan datos", async () => {
    process.env.JWT_SECRET = "clave-de-prueba";
    const token = crearToken({ id: 1, rol: "encargado" });
    const respuesta = await request(app)
      .post("/api/clientes")
      .set("Authorization", "Bearer " + token)
      .send({ nombre: "" });
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.errores.length).toBeGreaterThan(0);
  });

  it("validarCliente acepta nombre y teléfono sin correo", () => {
    const errores = validarCliente({ nombre: "Mariana López", telefono: "998 222 3344", correo: "" });
    expect(errores.length).toBe(0);
  });

  it("validarCliente acepta nombre y correo sin teléfono", () => {
    const errores = validarCliente({ nombre: "Braulio", telefono: "", correo: "prueba1@gmail.com" });
    expect(errores.length).toBe(0);
  });

  it("validarCliente pide teléfono o correo", () => {
    const errores = validarCliente({ nombre: "Ana", telefono: "", correo: "" });
    expect(errores.length).toBe(1);
  });

  it("validarCliente rechaza correo y teléfono inválidos", () => {
    const errores = validarCliente({ nombre: "Ana", telefono: "abc", correo: "sin-arroba" });
    expect(errores.length).toBe(2);
  });
});
});
