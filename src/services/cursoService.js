const Curso = require('../models/Curso');

exports.getAll = () => Curso.find().populate('profesor', 'nombre apellidos');
exports.getById = (id) => Curso.findById(id).populate('profesor', 'nombre apellidos');
exports.create = (data) => Curso.create(data);
exports.update = (id, cursoData) => Curso.findByIdAndUpdate(id, cursoData, { new: true, runValidators: true });
exports.remove = (id) => Curso.findByIdAndDelete(id);
