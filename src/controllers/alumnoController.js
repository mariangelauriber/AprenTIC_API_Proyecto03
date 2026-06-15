const alumnoService = require("../services/alumnoService");

exports.getAlumno = async (req, res, next) => {
  try {
    const alumno = await alumnoService.getAll();
    res.json(alumno);
  } catch (err) {
    next(err);
  }
};

exports.getAlumnoByEmail = async (req, res, next) => {
  try {
    const alumno = await alumnoService.getByEmail(req.params.email);

    if (!alumno) {
      return res.status(404).json({
        error: "Alumno no encontrado con ese email",
      });
    }

    res.json(alumno);
  } catch (err) {
    next(err);
  }
};

exports.getAlumnoById = async (req, res, next) => {
  try {
    const alumno = await alumnoService.getById(req.params.id);

    if (!alumno) {
      return res.status(404).json({
        error: "Alumno no encontrado",
      });
    }

    res.json(alumno);
  } catch (err) {
    next(err);
  }
};

exports.createAlumno = async (req, res, next) => {
  try {
    const alumno = await alumnoService.create(req.body);
    res.status(201).json(alumno);
  } catch (err) {
    next(err);
  }
};

exports.updateAlumno = async (req, res, next) => {
  try {
    const alumno = await alumnoService.update(req.params.id, req.body);

    if (!alumno) {
      return res.status(404).json({
        error: "Alumno no encontrado",
      });
    }

    res.json(alumno);
  } catch (err) {
    next(err);
  }
};

exports.deleteAlumno = async (req, res, next) => {
  try {
    const alumno = await alumnoService.remove(req.params.id);

    if (!alumno) {
      return res.status(404).json({
        error: "Alumno no encontrado",
      });
    }

    res.json({ mensaje: "Alumno eliminado" });
  } catch (err) {
    next(err);
  }
};
