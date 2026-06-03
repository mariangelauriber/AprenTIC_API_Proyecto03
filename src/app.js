const express = require('express');
const { constant } = require('lodash');
require('dotenv').config();

const conectDB = require('./config/db');
// CREAR MODELOS E IMPORTARLOS



const app = express();
app.use(express.json());

conectDB();

//FUNCION LOGGER
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
app.use(logger);

// NUESROS ENDPONTS VAN AQUÍ



// 5. 404 (penúltimo)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 6. error handler (último, 4 parámetros)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor levantado en " + PORT));