const router = require('express').Router();
const ctrl = require('../controllers/proyectoController');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationProyecto = [
  body('descripcion').isString().withMessage('Descripción incorrecta').trim().isLength({ min: 5, max: 200 }).withMessage('La descripción debe tener entre 5 y 200 caracteres'),
  body('fechaEntrega').optional().isISO8601().withMessage('Fecha de entrega no válida'),
  body('curso').optional().isMongoId().withMessage('ID de curso no válido')
];

router.get('/', ctrl.getProyectos);
router.get('/:id', ctrl.getProyectoById);
router.post('/', validationProyecto, validate, ctrl.createProyecto);
router.put('/:id', validationProyecto, validate, ctrl.updateProyecto);
router.delete('/:id', ctrl.deleteProyecto);

module.exports = router;