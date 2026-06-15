const mongoose = require("mongoose");

async function conectarDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no está definida en .env");
  }

  const timeoutMs = Number(process.env.DB_CONNECT_TIMEOUT_MS) || 15000;

  try {
    await Promise.race([
      mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Tiempo agotado conectando a la BBDD (${timeoutMs} ms)`));
        }, timeoutMs);
      }),
    ]);
    console.log("Conectado a BBDD");
  } catch (e) {
    console.error("No se pudo conectar a la BBDD:", e.message);
    throw e;
  }
}

module.exports = conectarDB;
