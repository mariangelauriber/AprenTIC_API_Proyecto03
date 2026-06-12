# AprenTIC Campus API

API REST para la gestión académica de un bootcamp multi-campus, construida con **Node.js**, **Express**, **MongoDB Atlas**, **Mongoose**, **JWT**, **bcrypt** y documentación interactiva con **Swagger**.

El proyecto permite gestionar usuarios académicos, cursos, proyectos, notas y métricas analíticas relacionadas con el rendimiento de los alumnos.

## Tecnologías utilizadas

- **Node.js**: entorno de ejecución JavaScript en backend.
- **Express**: framework para construir la API REST.
- **MongoDB Atlas**: base de datos no relacional en la nube.
- **Mongoose**: ODM para modelar colecciones y documentos.
- **JWT**: autenticación mediante tokens.
- **bcryptjs**: protección de contraseñas mediante hash.
- **express-validator**: validación de datos enviados por el cliente.
- **Swagger UI**: documentación visual y prueba de endpoints.
- **Jest / Supertest**: pruebas unitarias e integración.
- **HTML, CSS y JavaScript**: frontend básico para login y dashboard.


## Modelo lógico para MongoDB

Este proyecto implementa una base de datos **no relacional** con **MongoDB Atlas**. El modelo lógico no se traduce a tablas SQL, sino a colecciones de documentos.

Las relaciones entre entidades se representan mediante referencias con `ObjectId`.


### Lógica del modelo

Un PROFESOR imparte uno o varios CURSOS.
Un CURSO tiene muchos ALUMNOS.
Un CURSO tiene muchos PROYECTOS.
Una NOTA conecta un ALUMNO, un PROYECTO y el PROFESOR que evalúa.

La colección `Nota` funciona como entidad relacional, porque guarda la evaluación de un alumno sobre un proyecto específico.


### Colecciones principales

| `admin` | Usuarios con acceso total al sistema |
| `profesor` | Docentes que imparten cursos y corrigen notas |
| `alumno` | Estudiantes pertenecientes a un curso |
| `curso` | Agrupación académica o promoción |
| `proyecto` | Entregable evaluable dentro de un curso |
| `nota` | Relación evaluativa entre alumno, proyecto y profesor |
| `user` | Colección auxiliar para autenticación, login, password y rol, si se mantiene separada de las colecciones académicas |

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
├── especialidad
├── rol: "profesor"
└── campus

ALUMNO
├── _id
├── nombre
├── apellidos
├── email
├── password
├── edad
├── campus
├── rol: "alumno"
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
├── estado
└── observaciones

USER
├── _id
├── nombre
├── email
├── password
└── rol

La colección `User` se utiliza para autenticación cuando el login se centraliza en una sola colección. En ese caso, `Auth` consulta `User` para validar email, contraseña y rol.


## Arquitectura MVC

El proyecto sigue el patrón **Model–View–Controller** con las responsabilidades bien separadas en cada capa:

| `routes/` | Define endpoints y conecta cada ruta con su controller |
| `controllers/` | Recibe la petición HTTP y devuelve la respuesta |
| `services/` | Contiene la lógica de negocio y consultas a MongoDB |
| `models/` | Define los esquemas de Mongoose |
| `middleware/` | Contiene funciones intermedias como validación o autenticación |
| `docs/` | Configuración de Swagger |
| `public/` | Frontend estático con HTML, CSS y JavaScript |


## Flujo de una petición

Ejemplo: consulta de alumnos.

Cliente / Frontend / Swagger
        ↓
GET /alumno
        ↓
alumnoRoutes.js
        ↓
alumnoController.js
        ↓
alumnoService.js
        ↓
Alumno.js
        ↓
MongoDB Atlas

### Estructura de carpetas
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── docs/
│   └── swagger.js
├── middleware/
│   └── validator.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── profesorRoutes.js
│   ├── alumnoRoutes.js
│   ├── cursoRoutes.js
│   ├── proyectoRoutes.js
│   ├── notaRoutes.js
│   └── analyticsRoutes.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── profesorController.js
│   ├── alumnoController.js
│   ├── cursoController.js
│   ├── proyectoController.js
│   ├── notaController.js
│   └── analyticsController.js
├── services/
│   ├── adminService.js
│   ├── authService.js
│   ├── profesorService.js
│   ├── alumnoService.js
│   ├── cursoService.js
│   ├── proyectoService.js
│   ├── notaService.js
│   └── analyticsService.js
└── models/
    ├── Admin.js
    ├── User.js
    ├── Profesor.js
    ├── Alumno.js
    ├── Curso.js
    ├── Proyecto.js
    └── Nota.js

public/
├── index.html
├── login.html
├── dashboard.html
├── css/
│   └── styles.css
└── js/

data/
└── aprentic_datos.csv

diagrams/
├── er-model.md
└── logical-model.md

tests/


## Datos de prueba (CSV)

El archivo `data/aprentic_datos.csv` contiene los datos originales sin normalizar a partir de los cuales se ha diseñado el modelo de base de datos.

Incluye: 1 admin, 2 profesores, 6 alumnos, 2 cursos, 2 proyectos y 6 notas.


## CRUD implementado

### Admin

| `GET`     | `/admin/{email}` | Busca admin por email |
| `POST`    | `/admin`         | Crea un admin |
| `PUT`     | `/admin/{id}`    | Actualiza un admin |
| `DELETE`  | `/admin/{id}`    | Elimina un admin |

### Profesor

| `GET`    | `/profesor`       | Lista todos los profesores |
| `POST`   | `/profesor`       | Crea un profesor |
| `GET`    | `/profesor/{email}` | Busca profesor por email |
| `PUT`    | `/profesor/{id}`  | Actualiza un profesor |
| `DELETE` | `/profesor/{id}`  | Elimina un profesor |

### Alumno

| `GET`     | `/alumno`         | Lista todos los alumnos |
| `POST`    | `/alumno`         | Crea un alumno |
| `GET`     | `/alumno/{email}` | Busca alumno por email |
| `PUT`     | `/alumno/{id}`    | Actualiza un alumno |
| `DELETE`  | `/alumno/{id}`    | Elimina un alumno |

### Curso

| `GET`    | `/curso`          | Lista todos los cursos |
| `POST`   | `/curso`          | Crea un curso |
| `GET`    | `/curso/{id}`     | Busca curso por ID |
| `PUT`    | `/curso/{id}`     | Actualiza un curso |
| `DELETE` | `/curso/{id}`     | Elimina un curso |

### Proyecto


| `GET`    | `/proyecto`       | Lista todos los proyectos |
| `POST`   | `/proyecto`       | Crea un proyecto |
| `GET`    | `/proyecto/{id}`  | Busca proyecto por ID |
| `PUT`    | `/proyecto/{id}`  | Actualiza un proyecto |
| `DELETE` | `/proyecto/{id}`  | Elimina un proyecto |
 
### Notas


| `GET`    | `/nota`           | Lista todas las notas |
| `POST`   | `/nota`           | Crea una nota |
| `GET`    | `/nota/{id}`      | Busca nota por ID |
| `PUT`    | `/nota/{id}`      | Actualiza una nota |
| `DELETE` | `/nota/{id}`      | Elimina una nota |



## Instalación

Instalar dependencias:

```bash
npm install
```

## Ejecución del proyecto
Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Pruebas
Ejecutar tests:
```bash
npm test
```

Ejecutar tests con cobertura:
```bash
npm test -- --coverage
```

### Error `data and hash must be strings`

Este error ocurre cuando `bcrypt.compare()` recibe una contraseña que no es string.
En Swagger, la contraseña debe ir entre comillas:

```json
{
  "email": "admin@aprentic.com",
  "password": "123456"
}
```

No debe enviarse así:

```json
{
  "email": "admin@aprentic.com",
  "password": 123456
}
```



*Proyecto realizado para el módulo AprenTIC Full Stack Web — Sevilla*
