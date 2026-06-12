// Service de analytics: aquí viven las agregaciones de MongoDB.
// Una agregacion es una "tuberia" (pipeline): los documentos entran
// por la primera etapa y van pasando de etapa en etapa hasta el resultado.
const Nota = require("../models/Nota");

// 1) Tasa de aptos por campus
const aptosPorCampus = async () => {
  return Nota.aggregate([
    { $match: { alumno: { $ne: null } } },
    { $addFields: { alumnoOid: { $toObjectId: "$alumno" } } },
    { $lookup: { from: "alumno", localField: "alumnoOid", foreignField: "_id", as: "alumnoDato" } },
    { $unwind: "$alumnoDato" },
    {
      $group: {
        _id: "$alumnoDato.campus",
        totalNotas: { $sum: 1 },
        aptos: { $sum: { $cond: [{ $eq: ["$estado", "apto"] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        campus: "$_id",
        totalNotas: 1,
        aptos: 1,
        tasaAptos: { $round: [{ $multiply: [{ $divide: ["$aptos", "$totalNotas"] }, 100] }, 1] },
      },
    },
    { $sort: { tasaAptos: -1 } },
  ]);
};

// 2) Alumnos en riesgo
// Riesgo = media de calificacion menor que 5 O tener algun "no apto".
const alumnosEnRiesgo = async () => {
  return Nota.aggregate([
    { $match: { alumno: { $ne: null } } },
    { $addFields: { alumnoOid: { $toObjectId: "$alumno" } } },
    {
      $group: {
        _id: "$alumnoOid",
        media: { $avg: "$calificacion" },
        noAptos: { $sum: { $cond: [{ $eq: ["$estado", "no apto"] }, 1, 0] } },
      },
    },
    { $match: { $or: [{ media: { $lt: 5 } }, { noAptos: { $gte: 1 } }] } },
    { $lookup: { from: "alumno", localField: "_id", foreignField: "_id", as: "alumnoDato" } },
    { $unwind: "$alumnoDato" },
    {
      $project: {
        _id: 0,
        nombre: "$alumnoDato.nombre",
        apellidos: "$alumnoDato.apellidos",
        campus: "$alumnoDato.campus",
        media: { $round: ["$media", 1] },
        noAptos: 1,
      },
    },
    { $sort: { media: 1 } },
  ]);
};

// 3) Ranking de proyectos con mas "no apto"
const rankingNoAptos = async () => {
  return Nota.aggregate([
    { $match: { estado: "no apto", proyecto: { $ne: null } } },
    { $addFields: { proyectoOid: { $toObjectId: "$proyecto" } } },
    { $group: { _id: "$proyectoOid", noAptos: { $sum: 1 } } },
    { $lookup: { from: "proyecto", localField: "_id", foreignField: "_id", as: "proyectoDato" } },
    { $unwind: "$proyectoDato" },
    { $project: { _id: 0, proyecto: "$proyectoDato.nombre", noAptos: 1 } },
    { $sort: { noAptos: -1 } },
  ]);
};

module.exports = { aptosPorCampus, alumnosEnRiesgo, rankingNoAptos };