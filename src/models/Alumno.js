const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
<<<<<<< HEAD
  nombre:    { type: String, required: true },
  apellidos: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  rol:       { type: String, default: 'alumno' },
  edad:      { type: Number },
  campus:    { type: String },
  cursoId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
=======
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true},
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['admin', 'profesor', 'alumno'], default: 'alumno' },
  edad: { type: Number },
  campus: { type: String, trim: true },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }
>>>>>>> rocio-backend
});

module.exports = mongoose.model('Alumno', AlumnoSchema, 'alumno');