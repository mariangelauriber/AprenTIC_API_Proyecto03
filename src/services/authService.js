const User = require("../models/User");
const Admin = require("../models/Admin");
const Profesor = require("../models/Profesor");
const Alumno = require("../models/Alumno");

exports.buscarPorEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) return user;

  user = await Admin.findOne({ email });
  if (user) return { ...user.toObject(), role: user.rol };

  user = await Profesor.findOne({ email });
  if (user) return { ...user.toObject(), role: user.rol };

  user = await Alumno.findOne({ email });
  if (user) return { ...user.toObject(), role: user.rol };

  return null;
};

exports.crear = (data) => User.create(data);
