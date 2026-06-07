const proyectoService = require("../services/proyectoService");

exports.getProyectos = async (req, res, next) => {
    const proyectos = await proyectoService.getAll();
     res.json(proyectos);
};

exports.getProyectoById = async (req, res, next) => {
  const proyecto = await proyectoService.getById(req.params.id);
  res.json(proyecto);
};

exports.createProyecto = async (req,res,next) => {
  const proyecto = await proyectoService.create(req.body);
  res.status(201).json(proyecto);
  next();
};

exports.updateProyecto = async (req, res, next) => {
    try {
        const updatedProyecto = await proyectoService.actualizarProyecto(req.params.id, req.body);
        if (!updatedProyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(updatedProyecto);
    } catch (err) {
        next(err);
    }
};

exports.deleteProyecto = async (req, res, next) => {
    try {
        const deleteProyecto = await proyectoService.deleteProyecto(req.params.id); 
         if (!deleteProyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(deleteProyecto);
    } catch (err) {
        next(err);
    }
};

