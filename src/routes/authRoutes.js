const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const ctrl = require('../controller/authController');

const reglasRegistro = [
    body('email').trim().isEmail().withMessage('Email no válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('role').optional().isIn(['admin', 'teacher', 'user']).withMessage('Rol no válido'),
];

const reglasLogin = [
    body('email').trim().isEmail().withMessage('Email no válido').normalizeEmail(), body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

router.post('/register', reglasRegistro, validate, ctrl.register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string, example: "user@gmail.com"}
 *               password: {type: string, example: "tu contrasena"}
 *     responses:
 *       200:
 *         description: Login correcto
 *       400: 
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales inválidas
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: No tienes permisos para esto
 */
 


router.post('/login', reglasLogin, validate, ctrl.login);

module.exports = router;