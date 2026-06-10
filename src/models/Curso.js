const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  campus: { type: String, trim: true },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' }
});

module.exports = mongoose.model('Curso', CursoSchema, 'curso');