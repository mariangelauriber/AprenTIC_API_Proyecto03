const proyectoService = require("../services/proyectoService");

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
    res.json(proyecto);
  } catch (err) {
    next(err);
  }
};

exports.createProyecto = async (req, res, next) => {
  try {
    const proyecto = await proyectoService.create(req.body);
    res.status(201).json(proyecto);
  } catch (err) {
    next(err);
  }
};

exports.updateProyecto = async (req, res, next) => {
  try {
    const updatedProyecto = await proyectoService.update(req.params.id, req.body);
    if (!updatedProyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(updatedProyecto);
  } catch (err) {
    next(err);
  }
};

exports.deleteProyecto = async (req, res, next) => {
  try {
    const deleted = await proyectoService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
