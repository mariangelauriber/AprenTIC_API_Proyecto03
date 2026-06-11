const router = require('express').Router();
const ctrl = require('../controllers/alumnoController');
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

router.get('/', ctrl.getAlumno);
router.get('/:email', ctrl.getAlumno);

/**
 * @swagger
 * /alumnos:
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
 *
 *   post:
 *     summary: Crea un alumno
 *     tags: [Alumnos]
 *     responses:
 *       201:
 *         description: Alumno creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       409:
 *         description: Alumno ya existe
 *       500:
 *         description: Error del servidor
 */

router.post('/', validationAlumno, validate, ctrl.createAlumno);
router.put('/:id', validationAlumno, validate, ctrl.updateAlumno);
router.delete('/:id', ctrl.deleteAlumno);

module.exports = router;