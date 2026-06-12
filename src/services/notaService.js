const Nota = require('../models/Nota');

exports.getAll = () => Nota.find().populate('alumno', 'nombre apellidos').populate('proyecto', 'nombre descripcion');
exports.getById = (id) => Nota.findById(id).populate('alumno', 'nombre apellidos').populate('proyecto', 'nombre descripcion');
exports.getByAlumno = (alumnoId) => Nota.find({ alumno: alumnoId }).populate('proyecto', 'nombre descripcion');
exports.create = (data) => Nota.create(data);
exports.update = (id, notaData) => Nota.findByIdAndUpdate(id, notaData, { new: true, runValidators: true });
exports.remove = (id) => Nota.findByIdAndDelete(id);
