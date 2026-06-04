const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nombre:      { type: String, required: true },
  campus:      { type: String, required: true },
  fechaInicio: { type: Date },
  fechaFin:    { type: Date },
  profesorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' }
});

module.exports = mongoose.model('Curso', CursoSchema, 'curso');