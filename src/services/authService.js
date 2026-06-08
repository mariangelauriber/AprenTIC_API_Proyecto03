const User = require("../models/User");

exports.buscarPorEmail = (email) => User.findOne({ email });
exports.crear = (data) => User.create(data);

