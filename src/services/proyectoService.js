const Proyecto = require('../models/Proyecto');

exports.getAll = () => Proyecto.find().populate('curso', 'nombre');
exports.getById = (id) => Proyecto.findById(id).populate('curso', 'nombre');
exports.getRawById = (id) => Proyecto.findById(id);
exports.create = async (data) => {
  const proyecto = await Proyecto.create(data);
  return proyecto.populate('curso', 'nombre');
};
exports.update = (id, proyectoData) => Proyecto.findByIdAndUpdate(id, proyectoData, { returnDocument: 'after', runValidators: true }).populate('curso', 'nombre');
exports.remove = (id) => Proyecto.findByIdAndDelete(id);
