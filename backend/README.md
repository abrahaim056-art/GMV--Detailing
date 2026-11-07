# Backend - GMV Detailing Services (versión 2)

API REST con Node.js, Express, TypeScript y MySQL.
Incluye registro, inicio de sesión y dos roles: **cliente** (app móvil) y **encargado** (panel web).

## Estructura

```
backend/
├── sql/esquema.sql          tablas y servicios de ejemplo
├── src/
│   ├── config/              conexión a la base de datos
│   ├── controllers/         reciben la petición y responden
│   ├── middleware/          sesión, roles y errores
│   ├── repositories/        consultas SQL
│   ├── routes/              rutas de la API
│   ├── scripts/             crearEncargado.ts (crea la cuenta del dueño)
│   ├── types/               tipos de TypeScript
│   ├── utils/               reglas de negocio, token y contraseñas
│   ├── app.ts               configuración de Express
│   └── index.ts             arranque del servidor
└── test/app.test.ts
```

Flujo de una petición: routes -> middleware (sesión y rol) -> controllers -> repositories -> base de datos.

## Cómo funciona la sesión

1. El cliente se registra (`POST /api/auth/registro`) o inicia sesión (`POST /api/auth/iniciar-sesion`).
2. La API responde con un **token**.
3. En cada petición siguiente se manda el encabezado `Authorization: Bearer <token>`.
4. La API lee el rol del token y decide qué puede hacer esa persona.

La contraseña se guarda cifrada (bcrypt). El rol de una cuenta nueva siempre es `cliente`; la cuenta del encargado se crea con `npm run crear-encargado`.

## Permisos por rol

| Acción | Cliente | Encargado |
|--------|---------|-----------|
| Ver citas | Solo las suyas | Todas |
| Agendar una cita | Para sí mismo, con uno de sus vehículos | Para cualquier persona |
| Cancelar una cita | Solo la suya, si sigue Agendado | Cualquiera, según el flujo |
| Cambiar el estado (Recibido, En proceso, ...) | No | Sí |
| Administrar sus vehículos | Sí | No |
| Ver sus notificaciones | Sí | - |

## Endpoints

| Método | Ruta | Quién | Para qué |
|--------|------|-------|----------|
| GET | /api/salud | Todos | Revisar que el servidor funciona |
| POST | /api/auth/registro | Todos | Crear cuenta de cliente |
| POST | /api/auth/iniciar-sesion | Todos | Iniciar sesión |
| GET | /api/auth/yo | Con sesión | Datos de mi cuenta |
| GET | /api/servicios | Todos | Catálogo de servicios |
| GET | /api/vehiculos | Cliente | Mis vehículos |
| POST | /api/vehiculos | Cliente | Agregar un vehículo |
| GET | /api/citas?fecha=&estado= | Con sesión | Listar citas (cada rol ve lo suyo) |
| GET | /api/citas/:id | Con sesión | Detalle de una cita |
| POST | /api/citas | Con sesión | Crear cita (reglas 1, 2 y 4) |
| PATCH | /api/citas/:id/estado | Con sesión | Cambiar estado (regla 3) |
| GET | /api/notificaciones | Con sesión | Mis notificaciones |
| PATCH | /api/notificaciones/:id/leer | Con sesión | Marcar como leída |

## Cómo ejecutarlo (cuando la base de datos esté lista)

1. Crear las tablas con `sql/esquema.sql`.
2. Copiar `.env.example` como `.env` y llenar los datos (incluida `JWT_SECRET`).
3. Instalar y correr:

```bash
cd backend
npm install
npm run crear-encargado -- "Nombre del dueño" correo@ejemplo.com contraseña
npm run dev
```

Pruebas: `npm test` (no necesitan la base de datos).

## Pendiente

- Horario del negocio, días no laborables y número de bahías (reglas de disponibilidad).
- Administración de servicios y precios por el encargado.
- Notificaciones push al teléfono (hoy se guardan en la base de datos).
- Evitar empalmes cuando dos personas reservan al mismo tiempo (hoy se revisa antes de guardar).
