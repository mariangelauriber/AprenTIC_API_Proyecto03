require("dns").setServers(["8.8.8.8"]);

const mongoose = require("mongoose");

async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a BBDD:", mongoose.connection.db.databaseName);
    } catch (e) {
        console.error(e);
    }
}

module.exports = conectarDB;
