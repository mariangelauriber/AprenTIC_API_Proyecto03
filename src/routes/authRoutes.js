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
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("role")
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

router.post("/register", reglasRegistro, validate, ctrl.register);
router.post("/login", reglasLogin, validate, ctrl.login);

module.exports = router;
