const profesorService = require("../services/profesorService");

<<<<<<< HEAD
const getProfesor = async (req, res, next) => {
  const profesor = await profesorService.getAll();
  res.json(profesor);
};

module.exports = { getProfesor };
=======
exports.getProfesor = async (req, res, next) => {
    try {
        if (req.params.email) {
            const profesor = await profesorService.getProfesorPByEmail(req.params.email);
            if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado con ese email' });
            return res.json(profesor);
        }
        const profesor = await profesorService.getAll();
        res.json(profesor);
    } catch (err) {
        next(err);
    }
};
 
exports.createProfesor = async (req,res,next) => {
  const profesor = await profesorService.create(req.body);
  res.status(201).json(profesor);
  next();
};

exports.updateTeacher = async (req, res, next) => {
    try {
        const updatedProfesor = await profesorService.actualizarProfesor(req.params.id, req.body);
        if (!updatedProfesor) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json(updatedProfesor);
    } catch (err) {
        next(err);
    }
};

exports.deleteProfesor = async (req, res, next) => {
    try {
        const deleteProfesor = await profesorService.deleteProfesor(req.params.id); 
         if (!deleteProfesor) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json(deleteProfesor);
    } catch (err) {
        next(err);
    }
};
>>>>>>> rocio-backend
