const mongoose = require('mongoose');

const promocionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Promocion', promocionSchema);
