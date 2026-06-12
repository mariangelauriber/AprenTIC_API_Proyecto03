const Alumno = require('../models/Alumno');
const bcrypt = require('bcrypt');

exports.getAll = () => Alumno.find().populate('curso', 'nombre');
exports.getById = (id) => Alumno.findById(id).populate('curso', 'nombre');
exports.getByEmail = (email) => Alumno.findOne({ email });

exports.create = async (data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  return Alumno.create(data);
};

exports.update = async (id, alumnoData) => {
  if (alumnoData.password) alumnoData.password = await bcrypt.hash(alumnoData.password, 10);
  return Alumno.findByIdAndUpdate(id, alumnoData, { new: true, runValidators: true });
};

exports.remove = (id) => Alumno.findByIdAndDelete(id);
