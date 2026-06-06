const router = require('express').Router();
const ctrl = require('../controllers/NotaController');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationNota = [
  body('alumno').isMongoId().withMessage('ID de alumno no válido'),
  body('proyecto').isMongoId().withMessage('ID de proyecto no válido'),
  body('calificacion').isFloat({ min: 0, max: 10 }).withMessage('La calificación debe ser un número entre 0 y 10'),
  body('estado').isIn(['apto', 'no apto']).withMessage('El estado debe ser apto o no apto'),
  body('observaciones').optional().isString().withMessage('Observaciones incorrectas').trim()
];

router.get('/', ctrl.getAllNotas);
router.get('/:id', ctrl.getNota);
router.post('/', validationNota, validate, ctrl.createNota);
router.put('/:id', validationNota, validate, ctrl.updateNota);
router.delete('/:id', ctrl.deleteNota);

module.exports = router;