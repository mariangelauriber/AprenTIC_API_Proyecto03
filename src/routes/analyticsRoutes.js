const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const authRequired = require('../middleware/authRequired'); // verifica el JWT
const requireRole = require('../middleware/requireRole'); // autoriza por rol

/**
 * @swagger
 * /analytics/aptos-campus:
 *   get:
 *     summary: Tasa de aptos por campus (porcentaje de notas "apto")
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Lista con campus, total de notas, aptos y tasa
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/aptos-campus', authRequired, requireRole('admin', 'profesor'), ctrl.getAptosPorCampus);

/**
 * @swagger
 * /analytics/alumnos-riesgo:
 *   get:
 *     summary: Alumnos en riesgo (media menor a 5 o con algun "no apto")
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Lista de alumnos con su media y numero de no aptos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/alumnos-riesgo', authRequired, requireRole('admin', 'profesor'), ctrl.getAlumnosEnRiesgo);

/**
 * @swagger
 * /analytics/ranking-no-aptos:
 *   get:
 *     summary: Ranking de proyectos con mas notas "no apto"
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Lista de proyectos ordenada por numero de no aptos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/ranking-no-aptos', authRequired, requireRole('admin', 'profesor'), ctrl.getRankingNoAptos);

module.exports = router;



