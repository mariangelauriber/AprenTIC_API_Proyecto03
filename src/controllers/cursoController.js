const cursoService = require("../services/cursoService");

exports.getCursos = async (req, res, next) => {
  try {
    const cursos = await cursoService.getAll();
    res.json(cursos);
  } catch (err) {
    next(err);
  }
};

exports.getCursoById = async (req, res, next) => {
  try {
    const curso = await cursoService.getById(req.params.id);
    res.json(curso);
  } catch (err) {
    next(err);
  }
};

exports.createCurso = async (req, res, next) => {
  try {
    const curso = await cursoService.create(req.body);
    res.status(201).json(curso);
  } catch (err) {
    next(err);
  }
};

exports.updateCurso = async (req, res, next) => {
  try {
    const updatedCurso = await cursoService.update(req.params.id, req.body);
    if (!updatedCurso) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(updatedCurso);
  } catch (err) {
    next(err);
  }
};

exports.deleteCurso = async (req, res, next) => {
  try {
    const deleted = await cursoService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
