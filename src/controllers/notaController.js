const notaService = require("../services/notaService");

exports.getNotas = async (req, res, next) => {
  try {
    const notas = await notaService.getAll();
    res.json(notas);
  } catch (err) {
    next(err);
  }
};

exports.getNotaById = async (req, res, next) => {
  try {
    const nota = await notaService.getById(req.params.id);
    res.json(nota);
  } catch (err) {
    next(err);
  }
};

exports.createNota = async (req, res, next) => {
  try {
    const nota = await notaService.create(req.body);
    res.status(201).json(nota);
  } catch (err) {
    next(err);
  }
};

exports.updateNota = async (req, res, next) => {
  try {
    const nota = await notaService.getById(req.params.id);
    if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });

    if (req.user.role === 'profesor') {
      const notaProfesor = nota.profesor ? String(nota.profesor._id ?? nota.profesor) : null;
      if (notaProfesor !== String(req.user.sub)) {
        return res.status(403).json({ error: 'Solo puedes modificar notas asignadas a ti' });
      }
    }

    const updatedNota = await notaService.update(req.params.id, req.body);
    res.json(updatedNota);
  } catch (err) {
    next(err);
  }
};

exports.deleteNota = async (req, res, next) => {
  try {
    const deleted = await notaService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
