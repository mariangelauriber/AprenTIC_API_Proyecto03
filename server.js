require("dotenv").config();
const conectDB = require("./config/db");
const app = require('.src/app');


conectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor levantado en " + PORT));

