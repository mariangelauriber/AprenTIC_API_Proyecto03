const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  campus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campus' }],
}, { timestamps: true });

module.exports = mongoose.model('Profesor', profesorSchema);
