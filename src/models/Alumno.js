const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  apellidos: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  rol:       { type: String, default: 'alumno' },
  edad:      { type: Number },
  campus:    { type: String },
  cursoId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
});

module.exports = mongoose.model('Alumno', AlumnoSchema, 'alumno');