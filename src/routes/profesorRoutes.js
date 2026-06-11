const router = require("express").Router();
const ctrl = require("../controllers/profesorController");
const validate = require("../middleware/validator");
const authRequired = require("../middleware/authRequired");
const { body } = require("express-validator");
const requireRole = require("../middleware/requireRole");

const validationProfesor = [
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
  body("especialidad").isString().withMessage("Especialidad incorrecta").trim(),
  body("campus").isString().withMessage("Campus incorrecto").trim(),
];

router.use(authRequired);

/**
 * @swagger
 * /profesor:
 *   get:
 *     summary: Lista todos los profesores
 *     tags: [Profesor]
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       401:
 *         description: Sin token
 */

/**
 * @swagger
 * /profesor/{email}:
 *   get:
 *     summary: Busca profesor por email
 *     tags: [Profesor]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: profesor@aprentic.es
 *     responses:
 *       200:
 *         description: Profesor encontrado
 *       401:
 *         description: Sin token
 *       404:
 *         description: Profesor no encontrado
 */

/**
 * @swagger
 * /profesor:
 *   post:
 *     summary: Crea un profesor
 *     tags: [Profesor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellidos, email, especialidad, campus]
 *             properties:
 *               nombre: {type: string, example: "Laura"}
 *               apellidos: {type: string, example: "Gómez Ruiz"}
 *               email: {type: string, example: "profesor@aprentic.es"}
 *               especialidad: {type: string, example: "Desarrollo Web"}
 *               campus: {type: string, example: "Sevilla"}
 *     responses:
 *       201:
 *         description: Profesor creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 */

/**
 * @swagger
 * /profesor/{id}:
 *   put:
 *     summary: Actualiza un profesor
 *     tags: [Profesor]
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
 *             required: [nombre, apellidos, email, especialidad, campus]
 *             properties:
 *               nombre: {type: string, example: "Laura"}
 *               apellidos: {type: string, example: "Gómez Ruiz"}
 *               email: {type: string, example: "profesor@aprentic.es"}
 *               especialidad: {type: string, example: "Desarrollo Web"}
 *               campus: {type: string, example: "Sevilla"}
 *     responses:
 *       200:
 *         description: Profesor actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Sin token
 *       404:
 *         description: Profesor no encontrado
 */

/**
 * @swagger
 * /profesor/{id}:
 *   delete:
 *     summary: Elimina un profesor
 *     tags: [Profesor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1a2b3c4d5e6f78901234
 *     responses:
 *       200:
 *         description: Profesor eliminado
 *       401:
 *         description: Sin token
 *       404:
 *         description: Profesor no encontrado
 */

router.get("/", requireRole("admin", "profesor"), ctrl.getProfesor);
router.get("/:email", requireRole("admin", "profesor"), ctrl.getProfesorByEmail);
router.post("/", requireRole("admin"), validationProfesor, validate, ctrl.createProfesor);
router.put("/:id", requireRole("admin"), validationProfesor, validate, ctrl.updateProfesor);
router.delete("/:id", requireRole("admin"), ctrl.deleteProfesor);

module.exports = router;
