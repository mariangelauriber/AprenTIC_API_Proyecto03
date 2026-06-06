const Profesor = require("../models/Profesor");

exports.getAll = () => Profesor.find();
exports.getById = (id) => Profesor.findById(id);
exports.getByEmail = (email) => Profesor.findOne ({email});
exports.create = (data) => Profesor.create(data);
exports.update = (id, profesorData) => Profesor.findByIdAndUpdate(id, profesorData);
exports.delete = (id) => Profesor.findByIdAndDelete(id);
