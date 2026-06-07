const mongoose = require('mongoose');

const NotaSchema = new mongoose.Schema({
  alumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  calificacion: { type: Number, required: true, min: 0, max: 10 },
  estado: { type: String, required: true, enum: ['apto', 'no apto'] },
  observaciones: { type: String, trim: true }
});

module.exports = mongoose.model('Nota', NotaSchema, 'nota');