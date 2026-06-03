const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  promocion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promocion', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Proyecto', proyectoSchema);
