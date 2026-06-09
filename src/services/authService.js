const User = require("../models/User");

<<<<<<< HEAD
exports.buscarPorEmail = (email) => User.findOne({ email });
exports.crear = (data) => User.create(data);

=======

exports.getByEmail = (email) => User.findOne ({email});

exports.crear = (data) => User.create(data);
>>>>>>> rocio-backend
