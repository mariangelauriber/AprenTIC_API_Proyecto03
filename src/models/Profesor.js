const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true},
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['admin', 'profesor', 'alumno'], default: 'profesor' },
  especialidad: { type: String, trim: true },
  campus: { type: String, trim: true }
});

module.exports = mongoose.model('Profesor', ProfesorSchema, 'profesor');