require("dotenv").config();
const conectDB = require("./config/db");
const app = require('./app');

async function start() {
  await conectDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Servidor levantado en " + PORT));
}

start().catch(() => {
  process.exit(1);
});

