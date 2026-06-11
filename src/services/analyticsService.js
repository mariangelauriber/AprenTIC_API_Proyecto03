// Service de analytics: aquí viven las agregaciones de MongoDB.
// Una agregacion es una "tuberia" (pipeline): los documentos entran
// por la primera etapa y van pasando de etapa en etapa hasta el resultado.
const Nota = require("../models/Nota");

// 1) Tasa de aptos por campus
// Recorre las notas, busca el alumno de cada nota para saber su campus,
// agrupa por campus y calcula el porcentaje de notas "apto".
const aptosPorCampus = async () => {
  return Nota.aggregate([
    // $lookup = "join": trae el documento del alumno de cada nota
    { $lookup: { from: "alumno", localField: "alumno", foreignField: "_id", as: "alumno" } },
    // $unwind: convierte el array alumno:[{...}] en un objeto alumno:{...}
    { $unwind: "$alumno" },
    // $group: una fila por campus, contando total de notas y cuantas son "apto"
    {
      $group: {
        _id: "$alumno.campus",
        totalNotas: { $sum: 1 },
        aptos: { $sum: { $cond: [{ $eq: ["$estado", "apto"] }, 1, 0] } },
      },
    },
    // $project: damos forma a la salida y calculamos el porcentaje
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
    // Agrupamos las notas por alumno: media y cuantos "no apto" tiene
    {
      $group: {
        _id: "$alumno",
        media: { $avg: "$calificacion" },
        noAptos: { $sum: { $cond: [{ $eq: ["$estado", "no apto"] }, 1, 0] } },
      },
    },
    // Filtramos solo los que cumplen la condicion de riesgo
    { $match: { $or: [{ media: { $lt: 5 } }, { noAptos: { $gte: 1 } }] } },
    // Traemos los datos del alumno para mostrar nombre y campus
    { $lookup: { from: "alumno", localField: "_id", foreignField: "_id", as: "alumno" } },
    { $unwind: "$alumno" },
    {
      $project: {
        _id: 0,
        nombre: "$alumno.nombre",
        apellidos: "$alumno.apellidos",
        campus: "$alumno.campus",
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
    // Solo las notas suspensas
    { $match: { estado: "no apto" } },
    // Una fila por proyecto, contando cuantos "no apto" acumula
    { $group: { _id: "$proyecto", noAptos: { $sum: 1 } } },
    // Traemos el nombre del proyecto
    { $lookup: { from: "proyecto", localField: "_id", foreignField: "_id", as: "proyecto" } },
    { $unwind: "$proyecto" },
    { $project: { _id: 0, proyecto: "$proyecto.nombre", noAptos: 1 } },
    { $sort: { noAptos: -1 } },
  ]);
};

module.exports = { aptosPorCampus, alumnosEnRiesgo, rankingNoAptos };