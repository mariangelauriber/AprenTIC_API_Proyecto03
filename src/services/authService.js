const User = require("../models/User");
const Admin = require("../models/Admin");
const Profesor = require("../models/Profesor");

exports.buscarPorEmail = (email) => User.findOne({ email });
exports.crear = (data) => User.create(data);

exports.buscarCuentaPorEmail = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    const role = user.role || user.rol || "user";
    let profile = null;

    if (role === "admin") {
      profile = await Admin.findOne({ email });
    }

    if (role === "profesor") {
      profile = await Profesor.findOne({ email });
    }

    return {
      account: user,
      authCollection: "user",
      profile,
      role,
    };
  }

  const admin = await Admin.findOne({ email });

  if (admin) {
    return {
      account: admin,
      authCollection: "admin",
      profile: admin,
      role: "admin",
    };
  }

  const profesor = await Profesor.findOne({ email });

  if (profesor) {
    return {
      account: profesor,
      authCollection: "profesor",
      profile: profesor,
      role: "profesor",
    };
  }

  return null;
};

