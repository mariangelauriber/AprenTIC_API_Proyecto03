const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
<<<<<<< HEAD
  nombre:    { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  rol:       { type: String, default: 'admin' }
=======
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true},
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['admin', 'profesor', 'alumno'], default: 'admin' }
>>>>>>> rocio-backend
});

module.exports = mongoose.model('Admin', AdminSchema, 'admin');