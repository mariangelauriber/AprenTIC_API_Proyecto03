const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true, trim: true },
  fechaEntrega: { type: Date },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema, 'proyecto');