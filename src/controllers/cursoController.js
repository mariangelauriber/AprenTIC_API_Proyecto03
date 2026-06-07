const cursoService = require("../services/cursoService");

exports.getCursos = async (req, res, next) => {
    const cursos = await cursoService.getAll();
     res.json(cursos);
};

exports.getCursoById = async (req, res, next) => {
  const curso = await cursoService.getById(req.params.id);
  res.json(curso);
};

 
exports.createCurso = async (req,res,next) => {
  const curso = await cursoService.create(req.body);
  res.status(201).json(curso);
  next();
};

exports.updateCurso = async (req, res, next) => {
    try {
        const updatedCurso = await cursoService.actualizarCurso(req.params.id, req.body);
        if (!updatedCurso) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(updatedCurso);
    } catch (err) {
        next(err);
    }
};

exports.deleteCurso = async (req, res, next) => {
    try {
        const deleteCurso = await cursoService.deleteCurso(req.params.id); 
         if (!deleteCurso) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(deleteCurso);
    } catch (err) {
        next(err);
    }
};

