const mongoose = require ('mongoose');

const ProfesorSchema = new mongoose.Schema ({
    nombre: {type: String, required: true},
    email: {type: String},

});

module.exports = mongoose.model ('Profesor', ProfesorSchema, 'profesor');