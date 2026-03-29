# 🌾 AgriSmart AI — Agricultural Intelligence Hub

A full-stack agricultural dashboard with Claude AI backend, real-time data APIs, crop management, disease detection, and a conversational AI advisor.

---

## 🗂 Project Structure

```
agrismart-ai/
├── server.js              # Express server + all middleware
├── package.json
├── .env.example           # Copy to .env and fill in keys
├── data/
│   └── store.js           # In-memory data store (replace with DB)
├── routes/
│   ├── ai.js              # Claude AI: chat + disease detection + recommendations
│   ├── crops.js           # CRUD: crops management
│   ├── soil.js            # Soil analysis + recommendations
│   ├── market.js          # APMC mandi prices
│   ├── alerts.js          # Smart alerts
│   ├── tasks.js           # Farm task planner
│   └── weather.js         # Weather (mock or OpenWeatherMap)
└── public/
    └── index.html         # Full frontend SPA
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and add your keys:
```
ANTHROPIC_API_KEY=sk-ant-...         # Required: from console.anthropic.com
OPENWEATHER_API_KEY=...              # Optional: from openweathermap.org
PORT=3000
```

### 3. Start the server
```bash
# Production
npm start

# Development (auto-restart on file change)
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## 🔌 REST API Reference

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Summary stats (crops, revenue, weather, alerts) |
| GET | `/api/health` | Server + AI connection status |

### Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crops` | List all crops (filter by `?health=&field=`) |
| GET | `/api/crops/summary` | Crop count, health summary |
| GET | `/api/crops/:id` | Get single crop |
| POST | `/api/crops` | Add crop `{name, field, acres, emoji, sownDate, harvestDate}` |
| PUT | `/api/crops/:id` | Update crop |
| DELETE | `/api/crops/:id` | Remove crop |

### Soil
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/soil` | Full soil report with status labels |
| PUT | `/api/soil` | Update sensor readings |
| GET | `/api/soil/recommendations` | AI-style nutrient recommendations |

### Market Prices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market` | All prices (filter by `?category=vegetable\|grain\|pulse`) |
| GET | `/api/market/trending` | Top 5 price movers |
| GET | `/api/market/:id` | Single item + 7-day price history |
| PUT | `/api/market/:id` | Update price |

### Alerts & Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | All alerts (filter by `?read=true\|false`) |
| PUT | `/api/alerts/:id/read` | Mark alert as read |
| DELETE | `/api/alerts/:id` | Dismiss alert |
| GET | `/api/tasks` | All tasks (filter by `?done=&priority=`) |
| POST | `/api/tasks` | Add task `{title, date, description, priority}` |
| PUT | `/api/tasks/:id` | Update / mark done |
| DELETE | `/api/tasks/:id` | Delete task |

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather` | Current weather + 7-day forecast + farming advisories |

### AI (Claude-powered) — Rate limited: 20 req/min
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat advisor `{message, history[]}` |
| POST | `/api/ai/disease` | Disease detection — multipart/form-data with `image` file |
| POST | `/api/ai/recommend` | Crop recommendations `{soilPh, season, location, waterAvailability}` |

---

## 🌐 Features

| Feature | Details |
|---------|---------|
| 🏠 Dashboard | Live stats: crops, temperature, soil moisture, revenue estimate |
| 🌤️ Weather | 7-day forecast with farming advisories. Live via OpenWeatherMap or mock data |
| 🌱 Crops | Add/remove/track crops with health status, growth stage, and harvest dates |
| 🪨 Soil Analysis | N, P, K, pH, moisture, Ca, Mg readings + AI recommendations |
| 📈 Market | APMC mandi prices for vegetables, grains, pulses + trending chart |
| 🔬 Disease Detection | Upload crop photo → Claude analyzes for disease, severity, treatments |
| 🤖 AI Advisor | Multi-turn chat with Claude, pre-loaded with Indian farming expertise |
| 📅 Crop Planner | Task manager + seasonal calendar for Maharashtra farming schedule |
| 🔔 Alerts | Smart alerts for pests, irrigation needs, market opportunities |

---

## 🗄️ Upgrading to a Real Database

The in-memory store (`data/store.js`) resets on server restart. To persist data, replace it with:

**MongoDB (via Mongoose):**
```bash
npm install mongoose
```
```js
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

**PostgreSQL (via Prisma):**
```bash
npm install prisma @prisma/client
npx prisma init
```

**SQLite (simple, file-based):**
```bash
npm install better-sqlite3
```

---

## 🚢 Deployment

### Render / Railway / Fly.io
1. Push code to GitHub
2. Connect repo to Render/Railway
3. Set environment variables in dashboard
4. Deploy!

### Vercel (serverless)
Not recommended — this app uses a persistent Express server.

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔑 API Keys

| Key | Where to get | Required? |
|-----|-------------|-----------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | ✅ Yes (for AI features) |
| `OPENWEATHER_API_KEY` | [openweathermap.org](https://openweathermap.org/api) | ❌ No (mock data used if missing) |

---

## 📝 License
MIT — feel free to customize and deploy!
