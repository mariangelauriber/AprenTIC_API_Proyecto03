const Nota = require('../models/Nota');

exports.getAll = () => Nota.find().populate('alumno', 'nombre apellidos curso').populate('proyecto', 'nombre descripcion curso').populate('profesor', 'nombre apellidos email');
exports.getById = (id) => Nota.findById(id).populate('alumno', 'nombre apellidos curso').populate('proyecto', 'nombre descripcion curso').populate('profesor', 'nombre apellidos email');
exports.getRawById = (id) => Nota.findById(id);
exports.getByAlumno = (alumnoId) => Nota.find({ alumno: alumnoId }).populate('proyecto', 'descripcion');
exports.create = (data) => Nota.create(data);
exports.update = (id, notaData) => Nota.findByIdAndUpdate(id, notaData, { returnDocument: 'after', runValidators: true }).populate('alumno', 'nombre apellidos curso').populate('proyecto', 'nombre descripcion curso').populate('profesor', 'nombre apellidos email');
exports.updateEvaluacion = (id, data) => Nota.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).populate('alumno', 'nombre apellidos curso').populate('proyecto', 'nombre descripcion curso').populate('profesor', 'nombre apellidos email');
exports.remove = (id) => Nota.findByIdAndDelete(id);
