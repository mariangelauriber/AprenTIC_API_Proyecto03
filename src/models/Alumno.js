const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  promocion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promocion', required: true },
  foto: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Alumno', alumnoSchema);
