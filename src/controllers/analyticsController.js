// Controller de analytics: habla HTTP y delega la logica al service.
const service = require("../services/analyticsService");

const getAptosPorCampus = async (req, res, next) => {
  try {
    const data = await service.aptosPorCampus();
    res.status(200).json(data);
  } catch (error) {
    next(error); // lo recoge el errorHandler central
  }
};

const getAlumnosEnRiesgo = async (req, res, next) => {
  try {
    const data = await service.alumnosEnRiesgo();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getRankingNoAptos = async (req, res, next) => {
  try {
    const data = await service.rankingNoAptos();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAptosPorCampus, getAlumnosEnRiesgo, getRankingNoAptos };