const router = require("express").Router();
const ctrl = require("../controllers/cursoController");
const validate = require("../middleware/validator");
const { body } = require("express-validator");

const validationCurso = [
  body("nombre")
    .isString()
    .withMessage("Nombre incorrecto")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("descripcion")
    .optional()
    .isString()
    .withMessage("Descripción incorrecta")
    .trim(),
  body("campus").optional().isString().withMessage("Campus incorrecto").trim(),
  body("fechaInicio")
    .optional()
    .isISO8601()
    .withMessage("Fecha de inicio no válida"),
  body("fechaFin").optional().isISO8601().withMessage("Fecha de fin no válida"),
  body("profesor")
    .optional()
    .isMongoId()
    .withMessage("ID de profesor no válido"),
];

/**
 * @swagger
 * /curso:
 *   get:
 *     summary: Lista todos los cursos
 *     tags: [Curso]
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get("/", ctrl.getCursos);
router.get("/:id", ctrl.getCursoById);
router.post("/", validationCurso, validate, ctrl.createCurso);
router.put("/:id", validationCurso, validate, ctrl.updateCurso);
router.delete("/:id", ctrl.deleteCurso);

module.exports = router;
