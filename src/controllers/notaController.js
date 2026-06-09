const notaService = require("../services/notaService");

exports.getNotas = async (req, res, next) => {
    const notas = await notaService.getAll();
     res.json(notas);
};

exports.getNotaById = async (req, res, next) => {
  const nota = await notaService.getById(req.params.id);
  res.json(nota);
};
 
exports.createNota = async (req,res,next) => {
  const nota = await notaService.create(req.body);
  res.status(201).json(nota);
  next();
};

exports.updateNota = async (req, res, next) => {
    try {
        const updatedNota = await notaService.actualizarNota(req.params.id, req.body);
        if (!updatedNota) return res.status(404).json({ error: 'Nota no encontrada' });
        res.json(updatedNota);
    } catch (err) {
        next(err);
    }
};

exports.deleteNota = async (req, res, next) => {
    try {
        const deleteNota = await notaService.deleteNota(req.params.id); 
         if (!deleteNota) return res.status(404).json({ error: 'Nota no encontrada' });
        res.json(deleteNota);
    } catch (err) {
        next(err);
    }
};

