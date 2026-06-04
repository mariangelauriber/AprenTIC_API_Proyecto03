const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  rol:       { type: String, default: 'admin' }
});

module.exports = mongoose.model('Admin', AdminSchema, 'admin');