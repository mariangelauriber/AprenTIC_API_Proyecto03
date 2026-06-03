const connectDB = require('./config/db');
const app = require('./app');
const { PORT } = require('./config/env');

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
