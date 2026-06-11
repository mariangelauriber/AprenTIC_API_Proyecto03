const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validator");
const ctrl = require("../controllers/authController");

const reglasRegistro = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email no válido")
    .normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellidos").optional().trim(),
  body("rol")
    .optional()
    .isIn(["admin", "profesor", "user"])
    .withMessage("Rol no válido"),
];

const reglasLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email no válido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

/** 
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, nombre]
 *             properties:
 *               email: {type: string, example: "admin@aprentic.es"}
 *               password: {type: string, example: "admin1234"}
 *               nombre: {type: string, example: "John"}
 *               apellidos: {type: string, example: "Doe"}
 *               rol: {type: string, example: "user"}
 *           example:
 *             email: admin@aprentic.es
 *             password: admin1234
 *             nombre: John
 *             apellidos: Doe
 *             rol: user
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno del servidor
 */

router.post("/register", reglasRegistro, validate, ctrl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene Token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string, example: "admin@aprentic.es"}
 *               password: {type: string, example: "admin1234"}
 *           example:
 *             email: admin@aprentic.es
 *             password: admin1234
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

router.post("/login", reglasLogin, validate, ctrl.login);

module.exports = router;
