const router = require('express').Router();
const ctrl = require('../controllers/notaController');
const authRequired = require('../middleware/authRequired'); 
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationNota = [
  body('alumno').isMongoId().withMessage('ID de alumno no válido'),
  body('proyecto').isMongoId().withMessage('ID de proyecto no válido'),
  body('profesor').optional().isMongoId().withMessage('ID de profesor no válido'),
  body('calificacion').isFloat({ min: 0, max: 10 }).withMessage('La calificación debe ser un número entre 0 y 10'),
  body('estado').isIn(['apto', 'no apto']).withMessage('El estado debe ser apto o no apto'),
  body('observaciones').optional().isString().withMessage('Observaciones incorrectas').trim()
];


/**
 * @swagger
 * /nota:
 *   get:
 *     summary: Lista todos los notas
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/', authRequired, requireRole('admin', 'profesor'), ctrl.getNotas);
 
/**
 * @swagger
 * /nota/{id}:
 *   get:
 *     summary: Busca por ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5aa6e25693bbd4edc90
 *     responses:
 *       200:
 *         description: Encontrado
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authRequired, requireRole('admin', 'profesor'), ctrl.getNotaById);
 
/**
 * @swagger
 * /nota:
 *   post:
 *     summary: Crea un registro (admin y profesor)
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alumno, proyecto, calificacion, estado]
 *             properties:
 *               alumno: {type: string, example: "6a29c5aa6e25693bbd4edc80"}
 *               proyecto: {type: string, example: "6a29c5026e25693bbd4edc70"}
 *               profesor: {type: string, example: "6a29c5aa6e25693bbd4edc7c"}
 *               calificacion: {type: number, example: 8.5}
 *               estado: {type: string, example: "apto"}
 *               observaciones: {type: string, example: "Buen trabajo"}
 *           example:
 *             alumno: 6a29c5aa6e25693bbd4edc80
 *             proyecto: 6a29c5026e25693bbd4edc70
 *             profesor: 6a29c5aa6e25693bbd4edc7c
 *             calificacion: 8.5
 *             estado: apto
 *             observaciones: Buen trabajo
 *     responses:
 *       201:
 *         description: Creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.post('/', authRequired, requireRole('admin', 'profesor'), validationNota, validate, ctrl.createNota);
 
/**
 * @swagger
 * /nota/{id}:
 *   put:
 *     summary: Actualiza un registro (admin y profesor)
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5aa6e25693bbd4edc90
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calificacion: {type: number, example: 6}
 *               estado: {type: string, example: "apto"}
 *               observaciones: {type: string, example: "Recuperado"}
 *           example:
 *             calificacion: 6
 *             estado: apto
 *             observaciones: Recuperado
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authRequired, requireRole('admin', 'profesor'), validationNota, validate, ctrl.updateNota);
 
/**
 * @swagger
 * /nota/{id}:
 *   delete:
 *     summary: Elimina un registro (solo admin)
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5aa6e25693bbd4edc90
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteNota); // borrar: solo admin
 
module.exports = router;
