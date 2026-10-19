require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 4000;

// Conectar a la base de datos y luego encender el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor de BakeFlow corriendo en http://localhost:${PORT}`);
  });
});