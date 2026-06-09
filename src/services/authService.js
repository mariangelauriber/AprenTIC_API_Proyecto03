const User = require("../models/User");


exports.getByEmail = (email) => User.findOne ({email});

exports.crear = (data) => User.create(data);
