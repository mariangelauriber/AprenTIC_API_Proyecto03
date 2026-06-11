const router = require('express').Router();
const ctrl = require('../controllers/alumnoController');
const authRequired = require('../middleware/authRequired');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationAlumno = [
  body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),
  body('apellidos').isString().withMessage('Apellidos incorrecto').trim().isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
  body('email').isEmail().withMessage('Email incorrecto').trim().normalizeEmail(),
  body('edad').optional().isInt({ min: 16, max: 99 }).withMessage('La edad debe ser un número entre 16 y 99'),
  body('campus').optional().isString().withMessage('Campus incorrecto').trim(),
  body('curso').optional().isMongoId().withMessage('ID de curso no válido')
];



/**
 * @swagger
 * /alumno:
 *   get:
 *     summary: Lista todos los alumnos
 *     tags: [Alumnos]
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.get('/', authRequired, requireRole('admin', 'profesor'), ctrl.getAlumno);
 
/**
 * @swagger
 * /alumno/{email}:
 *   get:
 *     summary: Busca un alumno por su email
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: {type: string}
 *         example: sara.moreno@aprentic.com
 *     responses:
 *       200:
 *         description: Alumno encontrado
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Alumno no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:email', authRequired, requireRole('admin', 'profesor'), ctrl.getAlumno);
 
/**
 * @swagger
 * /alumno:
 *   post:
 *     summary: Crea un alumno (solo admin)
 *     tags: [Alumnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellidos, email]
 *             properties:
 *               nombre: {type: string, example: "Sara"}
 *               password: {type:string, example: "123456"}
 *               apellidos: {type: string, example: "Moreno Vega"}
 *               email: {type: string, example: "sara.moreno@aprentic.com"}
 *               edad: {type: number, example: 25}
 *               campus: {type: string, example: "Madrid"}
 *               curso: {type: string, example: "6a29c5026e25693bbd4edc60"}
 *           example:
 *             nombre: Sara
 *             apellidos: Moreno Vega
 *             password: 123456
 *             email: sara.moreno@aprentic.com
 *             edad: 25
 *             campus: Madrid
 *             curso: 6a29c5026e25693bbd4edc60
 *     responses:
 *       201:
 *         description: Alumno creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       409:
 *         description: Alumno ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/', authRequired, requireRole('admin'), validationAlumno, validate, ctrl.createAlumno);
 
/**
 * @swagger
 * /alumno/{id}:
 *   put:
 *     summary: Actualiza un alumno (solo admin)
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5aa6e25693bbd4edc80
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: {type: string, example: "Sara"}
 *               apellidos: {type: string, example: "Moreno Vega"}
 *               email: {type: string, example: "sara.moreno@aprentic.com"}
 *               edad: {type: number, example: 26}
 *               campus: {type: string, example: "Sevilla"}
 *               curso: {type: string, example: "6a29c5026e25693bbd4edc60"}
 *     responses:
 *       200:
 *         description: Alumno actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Alumno no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authRequired, requireRole('admin'), validationAlumno, validate, ctrl.updateAlumno);
 
/**
 * @swagger
 * /alumno/{id}:
 *   delete:
 *     summary: Elimina un alumno (solo admin)
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         example: 6a29c5aa6e25693bbd4edc80
 *     responses:
 *       200:
 *         description: Alumno eliminado
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Alumno no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteAlumno);
 

module.exports = router;