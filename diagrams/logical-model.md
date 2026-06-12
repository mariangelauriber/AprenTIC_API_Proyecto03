# Modelo Lógico — AprenTIC Campus API

Colecciones MongoDB y sus relaciones (MongoDB Atlas, base de datos `aprentic_campus`).

```
┌──────────────────────────────────────────────────────────────────┐
│  admin                                                           │
│  _id (PK) │ nombre │ apellidos │ email │ password │ rol          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│  profesor                                                                    │
│  _id (PK) │ nombre │ apellidos │ email │ password │ rol │ especialidad │ campus│
└──────────────────────────────────────────────────────────────────────────────┘
        │
        │ 1
        │ imparte
        │ N
        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  curso  (= Promoción)                                                        │
│  _id (PK) │ nombre │ descripcion │ campus │ fechaInicio │ fechaFin │ profesor │
└──────────────────────────────────────────────────────────────────────────────┘
        │                                      ▲
        │ 1                                    │ N pertenece_a
        │ tiene                                │
        │ N                             ┌──────────────────────────────────────┐
        ▼                               │  alumno                              │
┌─────────────────────────────────┐     │  _id (PK) │ nombre │ apellidos       │
│  proyecto                       │     │  email │ password │ rol │ edad       │
│  _id (PK) │ nombre │ descripcion│     │  campus │ curso (FK→curso)           │
│  fechaEntrega │ curso (FK→curso)│     └──────────────────────────────────────┘
└─────────────────────────────────┘                │
        │                                          │
        │ N  evaluado_en         recibe N           │
        └──────────────┐  ┌────────────────────────┘
                       ▼  ▼
        ┌───────────────────────────────────────────────────────────┐
        │  nota                                                     │
        │  _id (PK) │ alumno (FK→alumno) │ proyecto (FK→proyecto)  │
        │  profesor (FK→profesor) │ calificacion │ estado          │
        │  observaciones                                            │
        └───────────────────────────────────────────────────────────┘
                       ▲
                       │ evalua N
                       │ 1
                  [profesor]
```

## Cardinalidades

| Relación | Cardinalidad |
|----------|-------------|
| Profesor → Curso | 1 profesor imparte N cursos |
| Alumno → Curso | N alumnos pertenecen a 0-1 curso |
| Curso → Proyecto | 1 curso tiene N proyectos |
| Alumno → Nota | 1 alumno recibe N notas |
| Proyecto → Nota | 1 proyecto tiene N notas |
| Profesor → Nota | 1 profesor evalua N notas |

## Normalización aplicada

El CSV original contenía datos desnormalizados (campus repetido por fila, profesor
repetido, etc.). Se normalizó en 6 colecciones eliminando redundancias:

- `campus` extraído como atributo de `alumno`, `profesor` y `curso` (no como entidad
  propia, ya que en el dominio del bootcamp es solo un valor de texto).
- `nota` actúa como tabla de relación entre `alumno` y `proyecto`, con calificación
  y estado calculados.
- `admin` separado de `profesor`/`alumno` para no mezclar roles en una sola colección.
