const express = require("express");
const { constant } = require("lodash");
const swaggerSchema = require("./docs/swagger");
const swaggerUi = require("swagger-ui-express");


const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profesorRoutes = require("./routes/profesorRoutes");
const alumnoRoutes = require("./routes/alumnoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const notaRoutes = require("./routes/notaRoutes");

const path = require("path");

const app = express();
app.use(express.json());


function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
app.use(logger);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSchema));


app.use("/auth", authRoutes);
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

module.exports = app; 