const router = require("express").Router();
const ctrl = require("../controllers/proyectoController");
const validate = require("../middleware/validator");
const authRequired = require("../middleware/authRequired");
const requireRole = require("../middleware/requireRole");
const { body } = require("express-validator");

const validationProyecto = [
  body("nombre")
    .isString()
    .withMessage("Nombre incorrecto")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("descripcion")
    .optional()
    .isString()
    .withMessage("Descripcion incorrecta")
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripcion debe tener como maximo 200 caracteres"),
  body("fechaEntrega")
    .optional()
    .isISO8601()
    .withMessage("Fecha de entrega no valida"),
  body("curso").optional().isMongoId().withMessage("ID de curso no valido"),
];

/**
 * @swagger
 * /proyecto/{id}:
 *   delete:
 *     summary: Elimina un proyecto por ID
 *     tags: [Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 */

router.get("/", ctrl.getProyectos);
router.get("/:id", ctrl.getProyectoById);
router.post(
  "/",
  authRequired,
  requireRole("admin", "profesor"),
  validationProyecto,
  validate,
  ctrl.createProyecto,
);
router.put(
  "/:id",
  authRequired,
  requireRole("admin", "profesor"),
  validationProyecto,
  validate,
  ctrl.updateProyecto,
);
router.delete(
  "/:id",
  authRequired,
  requireRole("admin", "profesor"),
  ctrl.deleteProyecto,
);
router.post(
  "/:id/delete",
  authRequired,
  requireRole("admin", "profesor"),
  ctrl.deleteProyecto,
);

module.exports = router;
