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
 *     summary: Registra un usuario con contraseña hasheada
 *     description: Crea un usuario nuevo. La contraseña se envía en texto plano, pero el backend la guarda hasheada con bcrypt.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Rocio"
 *               apellidos:
 *                 type: string
 *                 example: "Rodriguez"
 *               email:
 *                 type: string
 *                 example: "admin@aprentic.es"
 *               password:
 *                 type: string
 *                 example: "admin1234"
 *                 description: El backend guardará esta contraseña hasheada con bcrypt.
 *               rol:
 *                 type: string
 *                 example: "admin"
 *                 enum: [admin, profesor, user]
 *           example:
 *             nombre: Rocio
 *             apellidos: Rodriguez
 *             email: admin@aprentic.es
 *             password: admin1234
 *             rol: admin
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente con contraseña hasheada
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El email ya está registrado
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
 *               email:
 *                 type: string
 *                 example: "admin@aprentic.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *           examples:
 *             admin:
 *               summary: Admin Laura
 *               value:
 *                 email: admin@aprentic.com
 *                 password: "123456"
 *           example:
 *             email: admin@aprentic.com
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login correcto
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", reglasLogin, validate, ctrl.login);

module.exports = router;
