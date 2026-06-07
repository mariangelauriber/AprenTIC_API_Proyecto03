# AprenTIC Campus API

API REST para la gestión académica de un bootcamp multi-campus, construida con **Node.js**, **Express** y **MongoDB Atlas**.


## Modelo lógico para MongoDB

Este proyecto implementa una base de datos **no relacional** con **MongoDB Atlas**. El modelo lógico no se traduce a tablas SQL, sino a colecciones de documentos. Las relaciones entre entidades se representan mediante **referencias con `ObjectId`**.


### Lógica del modelo

Un PROFESOR imparte un CURSO
Un CURSO tiene muchos ALUMNOS
Un CURSO tiene muchos PROYECTOS
Una NOTA conecta un ALUMNO + un PROYECTO + el PROFESOR que lo corrige


### Colecciones principales

| `Admin` | Acceso total al sistema. Gestiona usuarios y cursos |
| `Profesor` | Imparte cursos y corrige notas de sus alumnos |
| `Alumno` | Pertenece a un curso y puede consultar sus notas |
| `Curso` | Agrupación de alumnos (ej: "Full Stack Web Sevilla 2026") |
| `Proyecto` | Entregable evaluable dentro de un curso |
| `Nota` | Relación entre alumno, proyecto y profesor |

### Relaciones

Admin
└── gestiona todo el sistema

Profesor
└── imparte muchos Cursos
└── corrige muchas Notas

Curso
└── tiene muchos Alumnos
└── tiene muchos Proyectos
└── pertenece a un Profesor

Alumno
└── pertenece a un Curso
└── tiene muchas Notas

Proyecto
└── pertenece a un Curso
└── tiene muchas Notas

Nota
└── conecta Alumno + Proyecto + Profesor


### Esquema de colecciones

ADMIN
├── _id
├── nombre
├── email
├── password
└── rol: "admin"

PROFESOR
├── _id
├── nombre
├── apellidos
├── email
├── password
├── especialidad
├── rol: "profesor"
└── cursos: [cursoId]

ALUMNO
├── _id
├── nombre
├── apellidos
├── email
├── password
├── edad
├── campus
├── rol: "alumno"
└── cursoId

CURSO
├── _id
├── nombre
├── campus
├── fechaInicio
├── fechaFin
└── profesorId

PROYECTO
├── _id
├── nombre
├── descripcion
├── fechaEntrega
└── cursoId

NOTA
├── _id
├── alumnoId
├── proyectoId
├── profesorId
├── calificacion
├── estado
└── observaciones


## Arquitectura MVC

El proyecto sigue el patrón **Model–View–Controller** con las responsabilidades bien separadas en cada capa:

| `routes/` | Mapean las URLs a los controladores correspondientes |
| `controllers/` | Reciben la petición HTTP y devuelven la respuesta |
| `services/` | Contienen la lógica de negocio y las consultas a la base de datos |
| `models/` | Definen los esquemas de Mongoose para cada colección |


### Estructura de carpetas

src/
├── app.js
├── routes/
│   ├── adminRoutes.js
│   ├── profesorRoutes.js
│   ├── alumnoRoutes.js
│   ├── cursoRoutes.js
│   ├── proyectoRoutes.js
│   └── notaRoutes.js
├── controllers/
│   ├── adminController.js
│   ├── profesorController.js
│   ├── alumnoController.js
│   ├── cursoController.js
│   ├── proyectoController.js
│   └── notaController.js
├── services/
│   ├── adminService.js
│   ├── profesorService.js
│   ├── alumnoService.js
│   ├── cursoService.js
│   ├── proyectoService.js
│   └── notaService.js
└── models/
    ├── Admin.js
    ├── Profesor.js
    ├── Alumno.js
    ├── Curso.js
    ├── Proyecto.js
    └── Nota.js


## Datos de prueba (CSV)

El archivo `data/aprentic_datos.csv` contiene los datos originales sin normalizar
a partir de los cuales se ha diseñado el modelo de base de datos.

Incluye: 1 admin, 2 profesores, 6 alumnos, 2 cursos, 2 proyectos y 6 notas.


## CRUD implementado

### Admins

| `GET`    | `/admins`         | Obtener todos los admins |
| `GET`    | `/admins/:id`     | Obtener un admin por ID |
| `POST`   | `/admins`         | Crear un nuevo admin |
| `PUT`    | `/admins/:id`     | Actualizar un admin |
| `DELETE` | `/admins/:id`     | Eliminar un admin |

### Profesores

| `GET`    | `/profesores`     | Obtener todos los profesores |
| `GET`    | `/profesores/:id` | Obtener un profesor por ID |
| `POST`   | `/profesores`     | Crear un nuevo profesor |
| `PUT`    | `/profesores/:id` | Actualizar un profesor |
| `DELETE` | `/profesores/:id` | Eliminar un profesor |

### Alumnos

| `GET`    | `/alumnos`        | Obtener todos los alumnos |
| `GET`    | `/alumnos/:id`    | Obtener un alumno por ID |
| `POST`   | `/alumnos`        | Crear un nuevo alumno |
| `PUT`    | `/alumnos/:id`    | Actualizar un alumno |
| `DELETE` | `/alumnos/:id`    | Eliminar un alumno |

### Cursos

| `GET`    | `/cursos`         | Obtener todos los cursos |
| `GET`    | `/cursos/:id`     | Obtener un curso por ID |
| `POST`   | `/cursos`         | Crear un nuevo curso |
| `PUT`    | `/cursos/:id`     | Actualizar un curso |
| `DELETE` | `/cursos/:id`     | Eliminar un curso |

### Proyectos

| `GET`    | `/proyectos`      | Obtener todos los proyectos |
| `GET`    | `/proyectos/:id`  | Obtener un proyecto por ID |
| `POST`   | `/proyectos`      | Crear un nuevo proyecto |
| `PUT`    | `/proyectos/:id`  | Actualizar un proyecto |
| `DELETE` | `/proyectos/:id`  | Eliminar un proyecto |
 
### Notas

| `GET`    | `/notas`          | Obtener todas las notas |
| `GET`    | `/notas/:id`      | Obtener una nota por ID |
| `POST`   | `/notas`          | Crear una nueva nota |
| `PUT`    | `/notas/:id`      | Actualizar una nota |
| `DELETE` | `/notas/:id`      | Eliminar una nota |




*Proyecto realizado para el módulo AprenTIC Full Stack Web — Sevilla*
