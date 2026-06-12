const Profesor = require("../models/Profesor");
const bcrypt = require('bcrypt');

exports.getAll = () => Profesor.find();
exports.getById = (id) => Profesor.findById(id);
exports.getByEmail = (email) => Profesor.findOne({ email });

exports.create = async (data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  return Profesor.create(data);
};

exports.update = async (id, profesorData) => {
  if (profesorData.password) profesorData.password = await bcrypt.hash(profesorData.password, 10);
  return Profesor.findByIdAndUpdate(id, profesorData, { new: true, runValidators: true });
};

exports.delete = (id) => Profesor.findByIdAndDelete(id);
