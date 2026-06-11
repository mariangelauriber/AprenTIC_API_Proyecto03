const User = require("../models/User");
const Admin = require("../models/Admin");
const Profesor = require("../models/Profesor");
const Alumno = require("../models/Alumno");

// Busca el email en todas las colecciones y normaliza el campo de rol a 'role'
exports.buscarPorEmail = async (email) => {
  console.log('[auth] buscando email:', email);

  let user = await User.findOne({ email });
  console.log('[auth] user collection:', user ? user.email : 'null');
  if (user) return user;

  user = await Admin.findOne({ email });
  console.log('[auth] admin collection:', user ? user.email : 'null');
  if (user) return { ...user.toObject(), role: user.rol };

  user = await Profesor.findOne({ email });
  console.log('[auth] profesor collection:', user ? user.email : 'null');
  if (user) return { ...user.toObject(), role: user.rol };

  user = await Alumno.findOne({ email });
  console.log('[auth] alumno collection:', user ? user.email : 'null');
  if (user) return { ...user.toObject(), role: user.rol };

  return null;
};

exports.crear = (data) => User.create(data);
