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

router.use(authRequired);
router.use(requireRole("admin"));

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Obtiene un admin por ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del admin
 *     responses:
 *       200:
 *         description: Admin encontrado
 *       401:
 *         description: Sin token
 *       404:
 *         description: Admin no encontrado
 */

router.get("/", ctrl.getAdmins);
router.get("/:id", ctrl.getAdminById);
router.post("/", validationAdmin, validate, ctrl.createAdmin);
router.put("/:id", validationAdmin, validate, ctrl.updateAdmin);
router.delete("/:id", ctrl.deleteAdmin);

module.exports = router;
