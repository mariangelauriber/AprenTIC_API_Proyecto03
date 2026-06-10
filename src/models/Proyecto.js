const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  fechaEntrega: { type: Date },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema, 'proyecto');