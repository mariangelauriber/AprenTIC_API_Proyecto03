const mongoose = require('mongoose');

const NotaSchema = new mongoose.Schema({
  alumnoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
  proyectoId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  profesorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
  calificacion: { type: Number, required: true },
  estado:       { type: String, enum: ['apto', 'no apto'] },
  observaciones:{ type: String }
});

module.exports = mongoose.model('Nota', NotaSchema, 'nota');