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

router.get('/', authRequired, requireRole('admin', 'profesor'), ctrl.getNotas);
router.get('/:id',authRequired, requireRole('admin', 'profesor'), ctrl.getNotaById);
router.post('/', authRequired, requireRole('admin', 'profesor'), validationNota, validate, ctrl.createNota);
router.put('/:id', authRequired, requireRole('admin', 'profesor'), validationNota, validate, ctrl.updateNota);
router.delete('/:id', authRequired, requireRole('admin', 'profesor'), ctrl.deleteNota);

module.exports = router;