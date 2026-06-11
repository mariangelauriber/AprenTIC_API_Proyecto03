const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const validate = require("../middleware/validator");
const authRequired = require("../middleware/authRequired");
const { body } = require("express-validator");
const requireRole = require("../middleware/requireRole");

const validationAdmin = [
  body("nombre")
    .isString()
    .withMessage("Nombre incorrecto")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("apellidos")
    .isString()
    .withMessage("Apellidos incorrecto")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Los apellidos deben tener entre 2 y 50 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Email incorrecto")
    .trim()
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

router.use(authRequired)
router.use(requireRole("admin"));

/**
 * @swagger
 * /admin/{email}:
 *   get:
 *     summary: Busca admin por email
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: admin@aprentic.com
 *     responses:
 *       200:
 *         description: Admin encontrado
 *       401:
 *         description: Sin token
 *       404:
 *         description: Admin no encontrado
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Crea un admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellidos, email, password]
 *             properties:
 *               nombre: {type: string, example: "Carlos"}
 *               apellidos: {type: string, example: "Martínez López"}
 *               email: {type: string, example: "admin@aprentic.com"}
 *               password: {type: string, example: "123456"}
 *     responses:
 *       201:
 *         description: Admin creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 */

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Actualiza un admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1a2b3c4d5e6f78901234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: {type: string, example: "Carlos"}
 *               apellidos: {type: string, example: "Martínez López"}
 *               email: {type: string, example: "admin@aprentic.es"}
 *               password: {type: string, example: "admin1234"}
 *     responses:
 *       200:
 *         description: Admin actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       404:
 *         description: Admin no encontrado
 */

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Elimina un admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1a2b3c4d5e6f78901234
 *     responses:
 *       200:
 *         description: Admin eliminado
 *       401:
 *         description: Sin token
 *       404:
 *         description: Admin no encontrado
 */

router.get("/:email", ctrl.getAdmin);
router.post("/", validationAdmin, validate, ctrl.createAdmin);
router.put("/:id", validationAdmin, validate, ctrl.updateAdmin);
router.delete("/:id", ctrl.deleteAdmin);

module.exports = router;
