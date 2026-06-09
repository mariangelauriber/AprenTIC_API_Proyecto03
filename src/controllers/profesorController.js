const profesorService = require("../services/profesorService");

exports.getProfesor = async (req, res, next) => {
  try {
    const profesor = await profesorService.getAll();
    res.json(profesor);
  } catch (err) {
    next(err);
  }
};

exports.getProfesorByEmail = async (req, res, next) => {
  try {
    if (req.params.email) {
      const profesor = await profesorService.getByEmail(req.params.email);
      if (!profesor)
        return res.status(404).json({ error: "Profesor no encontrado con ese email" });
      return res.json(profesor);
    }
    const profesor = await profesorService.getAll();
    res.json(profesor);
  } catch (err) {
    next(err);
  }
};

exports.createProfesor = async (req, res, next) => {
  try {
    const profesor = await profesorService.create(req.body);
    res.status(201).json(profesor);
  } catch (err) {
    next(err);
  }
};

exports.updateProfesor = async (req, res, next) => {
  try {
    const updatedProfesor = await profesorService.update(req.params.id, req.body);
    if (!updatedProfesor)
      return res.status(404).json({ error: "Profesor no encontrado" });
    res.json(updatedProfesor);
  } catch (err) {
    next(err);
  }
};

exports.deleteProfesor = async (req, res, next) => {
  try {
    const deleted = await profesorService.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Profesor no encontrado" });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
