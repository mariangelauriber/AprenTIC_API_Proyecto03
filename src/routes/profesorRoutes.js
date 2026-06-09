const router = require('express').Router();

const ctrl = require('../controllers/profesorcontroller');
const validate = require('../middleware/validator');

const authRequired = require('../middleware/authRequired');
const { body } = require('express-validator');
const requireRole = require('../middleware/requireRole');


const validationProfesor = [
    body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),
    body('apellidos').isString().withMessage('Apellidos incorrecto').trim().isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
    body('email').isEmail().withMessage('Email incorrecto').trim().normalizeEmail(),
    body('especialidad').isString().withMessage('Especialidad incorrecta').trim(),
    body('campus').isString().withMessage('Campus incorrecto').trim()
];

router.use(authRequired);


router.get('/{:email}', ctrl.getProfesor);
router.get('/', ctrl.getAllProfesorByEmail);
router.post('/', validationProfesor, validate, ctrl.createProfesor);
router.put('/:id', validationProfesor, validate, ctrl.updateProfesor);
router.delete('/:id', ctrl.deleteProfesor);

module.exports = router;
