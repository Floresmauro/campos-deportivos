# Campos Deportivos - API Backend

Backend REST API para el sistema de gestión de campos deportivos.

## 🚀 Tecnologías

- **Node.js** + **Express** - Framework web
- **Supabase** - Base de datos PostgreSQL + Autenticación
- **JWT** - Tokens de autenticación via Supabase Auth

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🔑 Variables de Entorno

```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🗂️ Estructura del Proyecto

```
server/
├── routes/          # Rutas de la API
│   ├── auth.js      # Autenticación (login, register)
│   ├── users.js     # Gestión de usuarios
│   ├── stadiums.js  # CRUD de estadios
│   ├── assets.js    # Inventario/activos
│   ├── attendance.js # Sistema de fichaje
│   ├── requests.js  # Solicitudes (vacaciones, permisos)
│   ├── news.js      # Blog/noticias
│   ├── courses.js   # Capacitaciones
│   └── payroll.js   # Nómina/Recibos de pago
├── middleware/      # Middleware personalizado
│   ├── authMiddleware.js    # Verificación JWT
│   ├── roleMiddleware.js    # Control de acceso por roles
│   └── errorHandler.js      # Manejo centralizado de errores
├── index.js         # Punto de entrada
└── schema.sql       # Schema de base de datos
```

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/register` | Registrar usuario (admin) | ✅ Admin |
| POST | `/api/auth/logout` | Cerrar sesión | ✅ |
| POST | `/api/auth/refresh` | Refrescar token | ❌ |
| GET | `/api/auth/session` | Obtener sesión actual | ✅ |
| POST | `/api/auth/reset-password` | Solicitar reset de contraseña | ❌ |
| POST | `/api/auth/update-password` | Actualizar contraseña | ✅ |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Perfil del usuario actual | ✅ |
| GET | `/api/users` | Listar todos los usuarios | ✅ |
| GET | `/api/users/:id` | Obtener usuario específico | ✅ |
| PUT | `/api/users/:id` | Actualizar usuario | ✅ |

### Estadios (`/api/stadiums`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/stadiums` | Listar estadios | ❌ |
| GET | `/api/stadiums/:id` | Obtener estadio | ❌ |
| POST | `/api/stadiums` | Crear estadio | ✅ |
| PUT | `/api/stadiums/:id` | Actualizar estadio | ✅ |
| DELETE | `/api/stadiums/:id` | Eliminar estadio | ✅ |

### Activos/Inventario (`/api/assets`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/assets` | Listar activos | ❌ |
| GET | `/api/assets/:id` | Obtener activo | ❌ |
| POST | `/api/assets` | Crear activo | ✅ |
| PUT | `/api/assets/:id` | Actualizar activo | ✅ |
| DELETE | `/api/assets/:id` | Eliminar activo | ✅ |

### Asistencia/Fichaje (`/api/attendance`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/attendance` | Obtener registros | ✅ |
| POST | `/api/attendance/check-in` | Marcar entrada | ✅ |
| POST | `/api/attendance/check-out` | Marcar salida | ✅ |
| GET | `/api/attendance/user/:userId` | Registros de usuario | ✅ |

### Solicitudes (`/api/requests`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/requests` | Listar solicitudes | ✅ |
| GET | `/api/requests/:id` | Obtener solicitud | ✅ |
| POST | `/api/requests` | Crear solicitud | ✅ |
| PUT | `/api/requests/:id` | Actualizar solicitud | ✅ Admin |
| DELETE | `/api/requests/:id` | Eliminar solicitud | ✅ |

### Noticias (`/api/news`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/news` | Listar noticias | ❌ |
| GET | `/api/news/:id` | Obtener noticia | ❌ |
| POST | `/api/news` | Crear noticia | ✅ Admin |
| PUT | `/api/news/:id` | Actualizar noticia | ✅ Admin |
| DELETE | `/api/news/:id` | Eliminar noticia | ✅ Admin|

### Capacitaciones (`/api/courses`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | Listar cursos | ❌ |
| GET | `/api/courses/:id` | Obtener curso | ❌ |
| POST | `/api/courses` | Crear curso | ✅ Admin |
| PUT | `/api/courses/:id` | Actualizar curso | ✅ Admin |
| DELETE | `/api/courses/:id` | Eliminar curso | ✅ Admin |
| POST | `/api/courses/:id/enroll` | Inscribirse en curso | ✅ |
| GET | `/api/courses/:id/students` | Listar estudiantes | ✅ Admin/Manager |
| GET | `/api/courses/user/:userId/enrollments` | Cursos de usuario | ✅ |

### Nómina/Recibos (`/api/payroll`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/payroll` | Listar todos los recibos | ✅ Admin/Manager |
| GET | `/api/payroll/user/:userId` | Recibos de un usuario | ✅ (own/admin) |
| GET | `/api/payroll/:id` | Obtener recibo específico | ✅ (own/admin) |
| POST | `/api/payroll` | Crear recibo | ✅ Admin |
| PUT | `/api/payroll/:id` | Actualizar recibo | ✅ Admin |
| DELETE | `/api/payroll/:id` | Eliminar recibo | ✅ Admin |
| GET | `/api/payroll/:id/download` | URL de descarga del PDF | ✅ (own/admin) |

## 🔐 Autenticación

La API usa **Supabase Auth** con JWT. Para endpoints protegidos, incluir:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **admin** - Acceso completo al sistema
- **manager** - Gestión de estadio asignado
- **employee** - Acceso básico (perfil, fichaje, solicitudes)

## 📝 Ejemplos de Uso

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Crear Noticia (Admin)

```bash
curl -X POST http://localhost:3001/api/news \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva noticia",
    "content": "Contenido de la noticia...",
    "published": true
  }'
```

### Inscribirse en Curso

```bash
curl -X POST http://localhost:3001/api/courses/UUID/enroll \
  -H "Authorization: Bearer <token>"
```

### Crear Recibo de Pago (Admin)

```bash
curl -X POST http://localhost:3001/api/payroll \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-del-empleado",
    "month": 12,
    "year": 2025,
    "gross_salary": 50000.00,
    "net_salary": 42000.00,
    "deductions": 8000.00,
    "file_url": "https://storage.supabase.co/recibo.pdf"
  }'
```

## 🗄️ Base de Datos

El schema completo está en [`schema.sql`](./schema.sql). Para crear las tablas:

1. Ir a tu proyecto Supabase
2. SQL Editor → Ejecutar `schema.sql`

### Tablas Principales

- `profiles` - Perfiles de usuario  
- `stadiums` - Estadios/sedes
- `assets` - Inventario de maquinaria/herramientas
- `asset_movements` - Historial de movimientos
- `attendance` - Registros de asistencia
- `requests` - Solicitudes de vacaciones/permisos
- `news` - Blog/noticias
- `courses` - Capacitaciones
- `course_enrollments` - Inscripciones a cursos
- `payroll` - Recibos de pago/nómina

## 🛡️ Seguridad

- ✅ JWT via Supabase Auth
- ✅ Row Level Security (RLS) en Supabase
- ✅ Validación de roles con middleware
- ✅ Manejo centralizado de errores
- ✅ Rate limiting (recomendado añadir)

## 🚧 TODO

- [ ] Validación de inputs con express-validator
- [ ] Rate limiting con express-rate-limit
- [ ] Logging con Winston
- [ ] Tests con Jest
- [ ] Documentación Swagger/OpenAPI
- [ ] File uploads con Multer + Supabase Storage
- [ ] Email notifications
- [ ] QR code generation para activos

## 📞 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.
