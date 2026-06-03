const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  ciudad: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Campus', campusSchema);
