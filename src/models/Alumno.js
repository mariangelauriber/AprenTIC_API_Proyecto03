const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true},
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['admin', 'profesor', 'alumno'], default: 'alumno' },
  edad: { type: Number },
  campus: { type: String, trim: true },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
});

module.exports = mongoose.model('Alumno', AlumnoSchema, 'alumno');