const router = require('express').Router();
const ctrl = require('../controllers/proyectoController');
const authRequired = require('../middleware/authRequired'); // verifica el JWT
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationProyecto = [
  body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion').optional().isString().withMessage('Descripción incorrecta').trim().isLength({ min: 5, max: 200 }).withMessage('La descripción debe tener entre 5 y 200 caracteres'),
  body('fechaEntrega').optional().isISO8601().withMessage('Fecha de entrega no válida'),
  body('curso').optional().isMongoId().withMessage('ID de curso no válido')
];


/**
 * @swagger
 * /proyecto:
 *   get:
 *     summary: Lista todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/', authRequired, ctrl.getProyectos);
 
/**
 * @swagger
 * /proyecto/{id}:
 *   get:
 *     summary: Busca por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc70
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
router.get('/:id', authRequired, ctrl.getProyectoById);
 
/**
 * @swagger
 * /proyecto:
 *   post:
 *     summary: Crea un registro (solo admin)
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: {type: string, example: "API REST con Express"}
 *               descripcion: {type: string, example: "Proyecto integrador del módulo backend"}
 *               fechaEntrega: {type: string, example: "2026-06-12"}
 *               curso: {type: string, example: "6a29c5026e25693bbd4edc5f"}
 *           example:
 *             nombre: API REST con Express
 *             descripcion: Proyecto integrador del módulo backend
 *             fechaEntrega: 2026-06-12
 *             curso: 6a29c5026e25693bbd4edc5f
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
router.post('/', authRequired, requireRole('admin'), validationProyecto, validate, ctrl.createProyecto);
 
/**
 * @swagger
 * /proyecto/{id}:
 *   put:
 *     summary: Actualiza un registro (solo admin)
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc70
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: {type: string, example: "API REST con Express"}
 *               fechaEntrega: {type: string, example: "2026-06-19"}
 *           example:
 *             fechaEntrega: 2026-06-19
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
router.put('/:id', authRequired, requireRole('admin'), validationProyecto, validate, ctrl.updateProyecto);
 
/**
 * @swagger
 * /proyecto/{id}:
 *   delete:
 *     summary: Elimina un registro (solo admin)
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5026e25693bbd4edc70
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
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteProyecto);
 
module.exports = router;