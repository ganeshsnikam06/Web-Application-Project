// server.js — AgriSmart AI Backend
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Static Frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/crops', require('./routes/crops'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/market', require('./routes/market'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));

// ── Dashboard summary endpoint ─────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const store = require('./data/store');
  const crops = store.crops;
  const unreadAlerts = store.alerts.filter(a => !a.read).length;
  const pendingTasks = store.tasks.filter(t => !t.done).length;
  const totalAcres = crops.reduce((sum, c) => sum + c.acres, 0);
  const revenue = Math.round(totalAcres * 12000 * 1.18); // mock calc

  res.json({
    success: true,
    data: {
      activeCrops: crops.length,
      totalAcres,
      healthyCrops: crops.filter(c => ['Healthy', 'Excellent'].includes(c.health)).length,
      alertCrops: crops.filter(c => !['Healthy', 'Excellent'].includes(c.health)).length,
      avgTemp: 29,
      soilMoisture: store.soilData.moisture,
      estimatedRevenue: revenue,
      revenueGrowth: 18,
      unreadAlerts,
      pendingTasks,
      farmer: { name: 'Ganesh Nikam', location: 'Nashik, Maharashtra' },
    }
  });
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const isGeminiReady = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  const isAnthropicReady = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here';
  const isWeatherReady = !!process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiEnabled: !!(isGeminiReady || isAnthropicReady),
    weatherEnabled: isWeatherReady,
    version: '1.0.0',
  });
});

// ── Catch-all → serve frontend ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error handler ──────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌾 AgriSmart AI Server running on http://localhost:${PORT}`);
  console.log(`   AI Advisor: ${process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY ? '✅ Enabled' : '❌ Add GEMINI_API_KEY to .env'}`);
  console.log(`   Weather:    ${process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here' ? '✅ Live data' : '⚠️  Mock data (add OPENWEATHER_API_KEY for live)'}`);
  console.log(`   API docs:   http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
