const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre:       { type: String, required: true },
  descripcion:  { type: String },
  fechaEntrega: { type: Date },
  cursoId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema, 'proyecto');