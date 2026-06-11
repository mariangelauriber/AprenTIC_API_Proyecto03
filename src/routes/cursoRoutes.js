const router = require('express').Router();
const ctrl = require('../controllers/cursoController');
const authRequired = require('../middleware/authRequired'); 
const requireRole = require('../middleware/requireRole'); 
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationCurso = [
  body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('descripcion').optional().isString().withMessage('Descripción incorrecta').trim(),
  body('campus').optional().isString().withMessage('Campus incorrecto').trim(),
  body('fechaInicio').optional().isISO8601().withMessage('Fecha de inicio no válida'),
  body('fechaFin').optional().isISO8601().withMessage('Fecha de fin no válida'),
  body('profesor').optional().isMongoId().withMessage('ID de profesor no válido')
];


/**
 * @swagger
 * /curso:
 *   get:
 *     summary: Lista todos los cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/', authRequired, ctrl.getCursos);
 
/**
 * @swagger
 * /curso/{id}:
 *   get:
 *     summary: Busca por ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc5f
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
router.get('/:id', authRequired, ctrl.getCursoById);
 
/**
 * @swagger
 * /curso:
 *   post:
 *     summary: Crea un registro (solo admin)
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: {type: string, example: "Full Stack Web Sevilla 2026"}
 *               campus: {type: string, example: "Sevilla"}
 *               fechaInicio: {type: string, example: "2026-01-15"}
 *               fechaFin: {type: string, example: "2026-06-30"}
 *               profesor: {type: string, example: "6a29c5aa6e25693bbd4edc7c"}
 *           example:
 *             nombre: Full Stack Web Sevilla 2026
 *             campus: Sevilla
 *             fechaInicio: 2026-01-15
 *             fechaFin: 2026-06-30
 *             profesor: 6a29c5aa6e25693bbd4edc7c
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
router.post('/', authRequired, requireRole('admin'), validationCurso, validate, ctrl.createCurso);
 
/**
 * @swagger
 * /curso/{id}:
 *   put:
 *     summary: Actualiza un registro (solo admin)
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc5f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: {type: string, example: "Full Stack Web Sevilla 2026"}
 *               campus: {type: string, example: "Sevilla"}
 *               fechaFin: {type: string, example: "2026-07-15"}
 *           example:
 *             campus: Sevilla
 *             fechaFin: 2026-07-15
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
router.put('/:id', authRequired, requireRole('admin'), validationCurso, validate, ctrl.updateCurso);
 
/**
 * @swagger
 * /curso/{id}:
 *   delete:
 *     summary: Elimina un registro (solo admin)
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc5f
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
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteCurso);
 
module.exports = router;