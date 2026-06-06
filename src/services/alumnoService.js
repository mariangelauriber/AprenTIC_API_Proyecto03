const Alumno = require('../models/Alumno');

exports.getAll = () => Alumno.find().populate('curso', 'nombre');
exports.getById = (id) => Alumno.findById(id).populate('curso', 'nombre');
exports.getByEmail = (email) => Alumno.findOne({ email });
exports.create = (data) => Alumno.create(data);
exports.update = (id, alumnoData) => Alumno.findByIdAndUpdate(id, alumnoData);
exports.remove = (id) => Alumno.findByIdAndDelete(id);