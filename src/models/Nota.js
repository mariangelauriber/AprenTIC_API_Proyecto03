const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
  nota: { type: Number, required: true, min: 0, max: 10 },
  apto: { type: Boolean, required: true },
  observaciones: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Nota', notaSchema);
