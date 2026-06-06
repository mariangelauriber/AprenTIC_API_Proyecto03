const express = require("express");
const { constant } = require("lodash");
require("dotenv").config();

const conectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const profesorRoutes = require("./routes/profesorRoutes");
const alumnoRoutes = require("./routes/alumnoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const notaRoutes = require("./routes/notaRoutes");

const app = express();
app.use(express.json());

conectDB();

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
app.use(logger);

app.use("/admin", adminRoutes);
app.use("/profesor", profesorRoutes);
app.use("/alumno", alumnoRoutes);
app.use("/curso", cursoRoutes);
app.use("/proyecto", proyectoRoutes);
app.use("/nota", notaRoutes);

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
