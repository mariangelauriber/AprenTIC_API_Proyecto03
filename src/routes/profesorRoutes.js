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
  body("password")
    .optional()
    .isString()
    .withMessage("Contraseña incorrecta")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

router.use(authRequired);
router.get("/", ctrl.getProfesor);
router.post(
  "/",
  requireRole("admin"),
  validationProfesor,
  validate,
  ctrl.createProfesor,
);
router.get("/:email", ctrl.getProfesorByEmail);
router.put(
  "/:id",
  requireRole("admin"),
  validationProfesor,
  validate,
  ctrl.updateProfesor,
);
router.delete("/:id", requireRole("admin"), ctrl.deleteProfesor);

module.exports = router;
