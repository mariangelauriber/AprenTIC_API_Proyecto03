const express = require("express");
const _ = require("lodash");
require("dotenv").config();

const conectarDB = require("./src/config/db");

// CREAR MODELOS E IMPORTARLOS
/* const Admin = require('./models/Admin');
const Profesor = require('./models/Profesor'); */
const profesorRoutes = require("./src/routes/profesorRoutes");
//const adminRoutes = require("./routes/adminRoutes");


const app = express();
app.use(express.json());

conectarDB();

//FUNCION LOGGER
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
app.use(logger);


//RUTAS
app.use("/profesor", profesorRoutes);
//app.use("/admins", adminRoutes);


// NUESROS ENDPONTS VAN AQUÍ

//Consulta la primera entrada de la BD para Admin
/* app.get('/admin', async (req, res, next) => { 
  
  const admin = await Admin.findOne();
  //buena practica try and catch
  res.json(admin);
});

//Consulta entrada de la BD para Teacher
app.get('/teacher', async (req, res, next) => { 
  
  const teacher = await Teacher.find();
  //buena practica try and catch
  res.json(teacher);
}); */

// 5. 404 (penúltimo)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 6. error handler (último, 4 parámetros)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor levantado en " + PORT));
