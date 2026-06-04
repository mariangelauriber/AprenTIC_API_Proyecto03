const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
  nombre:       { type: String, required: true },
  apellidos:    { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  rol:          { type: String, default: 'profesor' },
  especialidad: { type: String },
  campus:       { type: String },
  cursos:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }]
});

module.exports = mongoose.model('Profesor', ProfesorSchema, 'profesor');