const proyectoService = require("../services/proyectoService");
const Curso = require("../models/Curso");

function obtenerId(valor) {
  if (!valor) return "";

  if (typeof valor === "string") return valor;

  if (valor._id) return String(valor._id);

  return String(valor);
}

async function validarCursoDelProfesor(req, cursoId) {
  const role = req.user?.role || req.user?.rol;

  // El admin puede gestionar cualquier curso
  if (role === "admin") return null;

  // Solo aplicamos esta validación especial a profesores
  if (role !== "profesor") return null;

  if (!cursoId) {
    return "Debes seleccionar uno de tus cursos para crear el proyecto";
  }

  const curso = await Curso.findById(cursoId);

  if (!curso) {
    return "Curso no encontrado";
  }

  // IMPORTANTE:
  // En tu base de datos los cursos tienen profesorId, no profesor.
  // Por eso miramos las dos opciones para que no falle.
  const profesorDelCurso = obtenerId(curso.profesor || curso.profesorId);

  const idsUsuario = [req.user?.sub, req.user?.id, req.user?.accountId]
    .filter(Boolean)
    .map(String);

  if (!profesorDelCurso || !idsUsuario.includes(profesorDelCurso)) {
    console.log("PROFESOR DEL CURSO:", profesorDelCurso);
    console.log("IDS DEL TOKEN:", idsUsuario);
    console.log("USUARIO TOKEN:", req.user);

    return "No puedes gestionar proyectos de un curso que no es tuyo";
  }

  return null;
}

exports.getProyectos = async (req, res, next) => {
  try {
    const proyectos = await proyectoService.getAll();
    res.json(proyectos);
  } catch (err) {
    next(err);
  }
};

exports.getProyectoById = async (req, res, next) => {
  try {
    const proyecto = await proyectoService.getById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json(proyecto);
  } catch (err) {
    next(err);
  }
};

exports.createProyecto = async (req, res, next) => {
  try {
    const errorPermiso = await validarCursoDelProfesor(req, req.body.curso);

    if (errorPermiso) {
      return res.status(403).json({ error: errorPermiso });
    }

    const proyecto = await proyectoService.create(req.body);
    res.status(201).json(proyecto);
  } catch (err) {
    next(err);
  }
};

exports.updateProyecto = async (req, res, next) => {
  try {
    const proyectoActual = await proyectoService.getRawById(req.params.id);

    if (!proyectoActual) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const cursoAValidar = req.body.curso || proyectoActual.curso;

    const errorPermiso = await validarCursoDelProfesor(req, cursoAValidar);

    if (errorPermiso) {
      return res.status(403).json({ error: errorPermiso });
    }

    const updatedProyecto = await proyectoService.update(
      req.params.id,
      req.body,
    );

    res.json(updatedProyecto);
  } catch (err) {
    next(err);
  }
};

exports.deleteProyecto = async (req, res, next) => {
  try {
    const proyecto = await proyectoService.getRawById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const errorPermiso = await validarCursoDelProfesor(req, proyecto.curso);

    if (errorPermiso) {
      return res.status(403).json({ error: errorPermiso });
    }

    const deleted = await proyectoService.remove(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
