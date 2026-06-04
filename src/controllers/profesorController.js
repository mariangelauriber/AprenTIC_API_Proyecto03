const profesorService = require("../services/profesorService");

const getProfesor = async (req, res, next) => {
  const profesor = await profesorService.getAll();
  res.json(profesor);
};

module.exports = { getProfesor };