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

router.get('/', authRequired, ctrl.getProyectos);
router.get('/:id', authRequired, ctrl.getProyectoById);
router.post('/', authRequired, requireRole('admin'), validationProyecto, validate, ctrl.createProyecto);
router.put('/:id', authRequired, requireRole('admin'), validationProyecto, validate, ctrl.updateProyecto);
router.delete('/:id', authRequired, requireRole('admin'), ctrl.deleteProyecto);

module.exports = router;