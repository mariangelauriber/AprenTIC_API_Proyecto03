const router = require("express").Router();
const ctrl = require("../controllers/notaController");
const validate = require("../middleware/validator");
const authRequired = require("../middleware/authRequired");
const requireRole = require("../middleware/requireRole");
const { body } = require("express-validator");

const validationNota = [
  body("alumno").isMongoId().withMessage("ID de alumno no valido"),
  body("proyecto").isMongoId().withMessage("ID de proyecto no valido"),
  body("profesor")
    .optional()
    .isMongoId()
    .withMessage("ID de profesor no valido"),
  body("calificacion")
    .isFloat({ min: 0, max: 10 })
    .withMessage("La calificacion debe ser un numero entre 0 y 10"),
  body("estado")
    .isIn(["apto", "no apto"])
    .withMessage("El estado debe ser apto o no apto"),
  body("observaciones")
    .optional()
    .isString()
    .withMessage("Observaciones incorrectas")
    .trim(),
];

const validationNotaParcial = [
  body("calificacion")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("La calificacion debe ser un numero entre 0 y 10"),
  body("estado")
    .optional()
    .isIn(["apto", "no apto"])
    .withMessage("El estado debe ser apto o no apto"),
  body("observaciones")
    .optional()
    .isString()
    .withMessage("Observaciones incorrectas")
    .trim(),
];

router.use(authRequired);
router.get("/", ctrl.getNotas);
router.get("/:id", ctrl.getNotaById);

/**
 * @swagger
 * /nota:
 *   post:
 *     summary: Crea una nueva nota
 *     tags: [Nota]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alumno
 *               - proyecto
 *               - calificacion
 *               - estado
 *             properties:
 *               alumno:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc61"
 *               proyecto:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc63"
 *               profesor:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc62"
 *               calificacion:
 *                 type: number
 *                 example: 8.5
 *               estado:
 *                 type: string
 *                 enum: [apto, "no apto"]
 *                 example: "apto"
 *               observaciones:
 *                 type: string
 *                 example: "Necesita repasar"
 *     responses:
 *       201:
 *         description: Nota creada
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Sin token
 */
router.post("/", validationNota, validate, ctrl.createNota);

/**
 * @swagger
 * /nota/{id}:
 *   put:
 *     summary: Actualiza una nota completa
 *     description: PUT actualiza la nota completa. Hay que enviar alumno, proyecto, calificacion y estado.
 *     tags: [Nota]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alumno
 *               - proyecto
 *               - calificacion
 *               - estado
 *             properties:
 *               alumno:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc61"
 *               proyecto:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc63"
 *               profesor:
 *                 type: string
 *                 example: "6a29c53b6e25693bbd4edc62"
 *               calificacion:
 *                 type: number
 *                 example: 8.5
 *               estado:
 *                 type: string
 *                 enum: [apto, "no apto"]
 *                 example: "apto"
 *               observaciones:
 *                 type: string
 *                 example: "Necesita repasar"
 *     responses:
 *       200:
 *         description: Nota actualizada completamente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Nota no encontrada
 */
router.put(
  "/:id",
  requireRole("admin", "profesor"),
  validationNota,
  validate,
  ctrl.updateNota,
);

/**
 * @swagger
 * /nota/{id}/evaluacion:
 *   patch:
 *     summary: Actualiza parcialmente una nota
 *     description: PATCH modifica solo los campos enviados.
 *     tags: [Nota]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calificacion:
 *                 type: number
 *                 example: 8.5
 *               estado:
 *                 type: string
 *                 enum: [apto, "no apto"]
 *                 example: "apto"
 *               observaciones:
 *                 type: string
 *                 example: "Necesita repasar"
 *     responses:
 *       200:
 *         description: Nota actualizada parcialmente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Sin token
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Nota no encontrada
 */
router.patch(
  "/:id/evaluacion",
  requireRole("admin", "profesor"),
  validationNotaParcial,
  validate,
  ctrl.evaluarNota,
);

router.delete("/:id", ctrl.deleteNota);
router.post("/:id/delete", ctrl.deleteNota);

module.exports = router;
