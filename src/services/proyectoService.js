const Proyecto = require('../models/Proyecto');

exports.getAll = () => Proyecto.find().populate('curso', 'nombre');
exports.getById = (id) => Proyecto.findById(id).populate('curso', 'nombre');
exports.create = (data) => Proyecto.create(data);
exports.update = (id, proyectoData) => Proyecto.findByIdAndUpdate(id, proyectoData, { new: true, runValidators: true });
exports.remove = (id) => Proyecto.findByIdAndDelete(id);
