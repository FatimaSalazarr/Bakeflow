const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');

const app = express();

// 1. Cabeceras de seguridad HTTP
app.use(helmet());

// 2. Configurar CORS (permite peticiones desde tu Vite local y tu GitHub Pages)
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://fatimasalazarr.github.io'],
  credentials: true
}));

// 3. Lectura de JSON con límite de peso seguro
app.use(express.json({ limit: '10mb' }));

// 4. Límite de peticiones contra ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: { message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.' }
});
app.use('/api', limiter);

// Ruta de verificación de salud del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'API de BakeFlow funcionando correctamente 🧁' });
  // Conectar rutas
  app.use('/api/auth', require('./routes/auth.routes'));
});

// Aquí iremos poniendo las rutas:
app.use('/api/auth', authRoutes);
// Conectar todas las rutas de la API de BakeFlow
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/bakeries', require('./routes/bakery.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/finances', require('./routes/finance.routes'));
app.use('/api/incidents', require('./routes/incident.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

module.exports = app;