const router = require('express').Router();
const profesorController = require("../controllers/profesorController");

//router.post("/", profesorController.create);
router.get("/", profesorController.getProfesor);

module.exports = router;