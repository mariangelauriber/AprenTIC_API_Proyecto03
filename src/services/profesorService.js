const Profesor = require("../models/Profesor");

exports.getAll = () => Profesor.find();

exports.create = async (data) => {
  if (!data.nombre || !data.email) {
    throw new Error("Faltan campos obligatorios");
  }

  const exists = await Profesor.findOne({ email: data.email });

  if (exists) {
    throw new Error("El profesor ya existe");
  }

  return await Profesor.create(data);
};