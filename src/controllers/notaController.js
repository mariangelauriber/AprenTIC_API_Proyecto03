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
    const updatedNota = await notaService.update(req.params.id, req.body);
    if (!updatedNota) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json(updatedNota);
  } catch (err) {
    next(err);
  }
};

exports.evaluarNota = async (req, res, next) => {
  try {
    const nota = await notaService.getRawById(req.params.id);

    if (!nota) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }

    const evaluacionData = {
      observaciones: req.body.observaciones || "",
    };

    if (req.body.calificacion !== undefined) {
      evaluacionData.calificacion = req.body.calificacion;
    }

    if (req.body.estado !== undefined) {
      evaluacionData.estado = req.body.estado;
    }

    const updatedNota = await notaService.updateEvaluacion(
      req.params.id,
      evaluacionData,
    );

    res.json(updatedNota);
  } catch (err) {
    next(err);
  }
};

exports.deleteNota = async (req, res, next) => {
  try {
    const deleted = await notaService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json({ mensaje: "Nota eliminada", nota: deleted });
  } catch (err) {
    next(err);
  }
};
