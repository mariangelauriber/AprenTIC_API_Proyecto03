const router = require('express').Router();
const ctrl = require('../controllers/AdminController');
const validate = require('../middleware/validator');
const { body } = require('express-validator');

const validationAdmin = [
  body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),
  body('apellidos').isString().withMessage('Apellidos incorrecto').trim().isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
  body('email').isEmail().withMessage('Email incorrecto').trim().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

router.get('/', ctrl.getAllAdmins);
router.get('/{:email}', ctrl.getAdmin);
router.post('/', validationAdmin, validate, ctrl.createAdmin);
router.put('/:id', validationAdmin, validate, ctrl.updateAdmin);
router.delete('/:id', ctrl.deleteAdmin);

module.exports = router;