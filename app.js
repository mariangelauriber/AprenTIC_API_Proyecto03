const express = require("express");
const _ = require("lodash");
require("dotenv").config();

const conectarDB = require("./src/config/db");

const profesorRoutes = require("./src/routes/profesorRoutes");
const alumnoRoutes = require("./src/routes/alumnoRoutes");
const cursoRoutes = require("./src/routes/cursoRoutes");
const proyectoRoutes = require("./src/routes/proyectoRoutes");
const notaRoutes = require("./src/routes/notaRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
app.use(express.json());

conectarDB();

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
app.use(logger);

app.use("/profesor", profesorRoutes);
app.use("/alumno", alumnoRoutes);
app.use("/curso", cursoRoutes);
app.use("/proyecto", proyectoRoutes);
app.use("/nota", notaRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor levantado en " + PORT));