# AprenTIC Campus API

API REST con Node.js, Express, MongoDB Atlas y Mongoose para gestionar información académica: usuarios, profesores, alumnos, cursos, proyectos y notas. El proyecto incluye también una interfaz web sencilla en `public/` para iniciar sesión y consultar los datos desde un dashboard.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT para autenticación
- bcrypt para hash de contraseñas
- express-validator para validación
- Swagger UI en `/api-docs`
- HTML, CSS y JavaScript vanilla para el frontend

## Modelo lógico

El proyecto usa una base de datos no relacional en MongoDB Atlas. Las relaciones entre entidades se representan mediante referencias con `ObjectId`.

Un profesor imparte uno o varios cursos.

Un curso tiene muchos alumnos.

Un curso tiene muchos proyectos.

Una nota conecta un alumno, un proyecto y el profesor que corrige.

Además, la autenticación se gestiona mediante una colección `user`, usada por `/auth/register` y `/auth/login`. Esta colección guarda las credenciales y el rol del usuario que inicia sesión.

## Colecciones principales

| Colección | Descripción |
| --- | --- |
| `user` | Usuarios que pueden iniciar sesión. Contiene `email`, `password` y `role`. |
| `admin` | Datos de administradores del sistema. |
| `profesor` | Profesores que imparten cursos y corrigen notas. |
| `alumno` | Alumnos asociados a cursos. |
| `curso` | Cursos académicos asociados opcionalmente a un profesor. |
| `proyecto` | Proyectos o entregables asociados a cursos. |
| `nota` | Calificaciones relacionadas con alumno, proyecto y profesor. |

## Esquema de colecciones

```txt
USER
├── _id
├── nombre
├── apellidos
├── email
├── password
├── role: "admin" | "profesor" | "user"
├── especialidad
├── campus
└── cursos

ADMIN
├── _id
├── nombre
├── apellidos
├── email
├── password
└── rol: "admin"

PROFESOR
├── _id
├── nombre
├── apellidos
├── email
├── password
├── rol: "profesor"
├── especialidad
└── campus

ALUMNO
├── _id
├── nombre
├── apellidos
├── email
├── password
├── rol: "alumno"
├── edad
├── campus
└── curso

CURSO
├── _id
├── nombre
├── descripcion
├── campus
├── fechaInicio
├── fechaFin
└── profesor

PROYECTO
├── _id
├── nombre
├── descripcion
├── fechaEntrega
└── curso

NOTA
├── _id
├── alumno
├── proyecto
├── profesor
├── calificacion
├── estado: "apto" | "no apto"
└── observaciones
```

## Roles y permisos

El login devuelve un token JWT con el rol del usuario.

- `admin`: puede acceder a las rutas protegidas de administración y ver toda la información en el dashboard.
- `profesor`: puede iniciar sesión y el dashboard filtra visualmente cursos, alumnos, proyectos y notas relacionados con su perfil.
- `user`: rol por defecto de la colección `user`.

Nota: el filtrado del profesor se realiza actualmente en el frontend, dentro de `public/js/dashboard.js`, a partir de las relaciones entre colecciones. Las rutas específicas del backend para alumnos, cursos, proyectos y notas no aplican todavía ese filtrado por profesor.

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_bbdd?appName=...
JWT_SECRET=change_this_secret
```

También existe `.env.example` como plantilla.

Si MongoDB Atlas no conecta, revisa en Atlas:

- `Network Access`: añade tu IP actual.
- Usuario y contraseña de la URI.
- Nombre de la base de datos.
- Que el puerto `27017` no esté bloqueado por tu red.

## Instalación

```bash
npm install
```

En Windows PowerShell puede aparecer un error de política de ejecución con `npm`. En ese caso usa `npm.cmd`:

```powershell
npm.cmd install
```

## Arranque

Modo normal:

```bash
npm start
```

En Windows PowerShell:

```powershell
npm.cmd start
```

Modo desarrollo con nodemon:

```bash
npm run dev
```

En Windows PowerShell:

```powershell
npm.cmd run dev
```

El servidor escucha por defecto en:

```txt
http://localhost:3000
```

## Documentación Swagger

Con el servidor levantado, la documentación Swagger está disponible en:

```txt
http://localhost:3000/api-docs
```

## Frontend

La interfaz está en la carpeta `public/`:

- `public/login.html`
- `public/dashboard.html`
- `public/css/styles.css`
- `public/js/api.js`
- `public/js/auth.js`
- `public/js/dashboard.js`

El frontend llama a la API configurada en:

```js
const API_BASE_URL = "http://localhost:3000";
```

Después de iniciar sesión, el token se guarda en `localStorage` como `aprentic_token`, y los datos del usuario como `aprentic_user`.

## Endpoints

### Auth

| Método | Endpoint | Descripción | Protección |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registrar usuario en la colección `user` | Pública |
| `POST` | `/auth/login` | Iniciar sesión y obtener token JWT | Pública |

### Admins

Estas rutas requieren token JWT y rol `admin`.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/admin` | Obtener todos los admins |
| `GET` | `/admin/:email` | Obtener un admin por email |
| `POST` | `/admin` | Crear un nuevo admin |
| `PUT` | `/admin/:id` | Actualizar un admin |
| `DELETE` | `/admin/:id` | Eliminar un admin |

### Profesores

Estas rutas requieren token JWT.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/profesor` | Obtener todos los profesores |
| `GET` | `/profesor/:email` | Obtener un profesor por email |
| `POST` | `/profesor` | Crear un nuevo profesor |
| `PUT` | `/profesor/:id` | Actualizar un profesor |
| `DELETE` | `/profesor/:id` | Eliminar un profesor |

### Alumnos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/alumno` | Obtener todos los alumnos |
| `GET` | `/alumno/:email` | Obtener un alumno por email |
| `POST` | `/alumno` | Crear un nuevo alumno |
| `PUT` | `/alumno/:id` | Actualizar un alumno |
| `DELETE` | `/alumno/:id` | Eliminar un alumno |

### Cursos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/curso` | Obtener todos los cursos |
| `GET` | `/curso/:id` | Obtener un curso por ID |
| `POST` | `/curso` | Crear un nuevo curso |
| `PUT` | `/curso/:id` | Actualizar un curso |
| `DELETE` | `/curso/:id` | Eliminar un curso |

### Proyectos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/proyecto` | Obtener todos los proyectos |
| `GET` | `/proyecto/:id` | Obtener un proyecto por ID |
| `POST` | `/proyecto` | Crear un nuevo proyecto |
| `PUT` | `/proyecto/:id` | Actualizar un proyecto |
| `DELETE` | `/proyecto/:id` | Eliminar un proyecto |

### Notas

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/nota` | Obtener todas las notas |
| `GET` | `/nota/:id` | Obtener una nota por ID |
| `POST` | `/nota` | Crear una nueva nota |
| `PUT` | `/nota/:id` | Actualizar una nota |
| `DELETE` | `/nota/:id` | Eliminar una nota |

## Tests

El proyecto define tests con Jest:

```bash
npm test
```

En Windows PowerShell:

```powershell
npm.cmd test
```

Si `jest` no se reconoce como comando, vuelve a instalar dependencias con `npm.cmd install`.
