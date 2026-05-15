require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Security ───────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
]
  .flatMap(o => o.split(','))
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

// Global rate limit: 100 req / 15 min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/contact',        require('./routes/contact'));
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/admin',          require('./routes/admin'));
app.use('/api/admin/projects', require('./routes/adminProjects'));
app.use('/api/admin/messages', require('./routes/adminMessages'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── DB + Start ─────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
