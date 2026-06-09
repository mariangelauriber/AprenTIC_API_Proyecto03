const router = require('express').Router();
<<<<<<< HEAD

const ctrl = require('../controllers/Profesorcontroller');
const validate = require('../middleware/validator');

=======
const ctrl = require('../controller/profesorController');
const validate = require('../middleware/validator');
>>>>>>> rocio-backend
const authRequired = require('../middleware/authRequired');
const { body } = require('express-validator');
const requireRole = require('../middleware/require_role');



const requireRole = require('../middleware/requireRole');

const validationProfesor = [
    body('nombre').isString().withMessage('Nombre incorrecto').trim().isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres'),
    body('apellidos').isString().withMessage('Apellidos incorrecto').trim().isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
    body('email').isEmail().withMessage('Email incorrecto').trim().normalizeEmail(),
    body('especialidad').isString().withMessage('Especialidad incorrecta').trim(),
    body('campus').isString().withMessage('Campus incorrecto').trim()
];

<<<<<<< HEAD
router.use(authRequired);


router.get('/{:email}', requireRole("profesor"), ctrl.getProfesor);
=======

router.use(authRequired);


/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Lista todos los teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Lista de teachers
 *       401:
 *        description: Sin token
 *       500:
 *        description: No tienes permisos para esto
 */


router.get('/{:email}', ctrl.getProfesor);


>>>>>>> rocio-backend
router.get('/', ctrl.getAllProfesores);
router.post('/', validationProfesor, validate, ctrl.createProfesor);
router.put('/:id', validationProfesor, validate, ctrl.updateProfesor);
router.delete('/:id', ctrl.deleteProfesor);

module.exports = router;
