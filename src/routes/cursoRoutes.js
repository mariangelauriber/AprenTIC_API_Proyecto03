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

router.get('/', authRequired, ctrl.getCursos);
router.get('/:id', authRequired, ctrl.getCursoById);
router.post('/', authRequired, requireRole('admin'), validationCurso, validate, ctrl.createCurso);
router.put('/:id', authRequired, requireRole('admin'), validationCurso, validate, ctrl.updateCurso);
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteCurso);

module.exports = router;