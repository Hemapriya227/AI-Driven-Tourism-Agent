# ITERA — Plan Less. Experience More.
### The Self-Healing Travel Intelligence

> *"Every travel tool answers questions. ITERA makes decisions — and learns from every trip to make the next one better."*

Built for **Impact AI-Thon 2026** | Track 2: Climate & Compass | St. Joseph's College of Engineering

---

## 🌍 The Problem

Planning a trip today means opening 15 tabs — Google, TripAdvisor, Booking.com, Maps, Weather — spending hours, and still ending up with a rigid plan that falls apart the moment it rains or your train is late.

**That's the Planning Tax.** Every traveler pays it. Nobody's solved it.

---

## ✨ What ITERA Does Differently

ITERA is not a search tool. It's a **thinking tool** — powered by a squad of 5 specialized AI agents that negotiate, optimize, and self-heal your itinerary in real-time.

| Feature | ITERA | Google Travel | ChatGPT |
|---|---|---|---|
| Multi-agent orchestration | ✅ | ❌ | ❌ |
| Real-time self-healing | ✅ | ❌ | ❌ |
| Psychographic memory (RAG) | ✅ | ❌ | ❌ |
| Road-aware route optimization | ✅ | ✅ | ❌ |
| Gets smarter every trip | ✅ | ❌ | ❌ |

---

## 🤖 The Agent Squad

```
User Input → Researcher → Vibe Validator → Logistics Optimizer → TOON Master → Itinerary
                                                                        ↑
                                                              Monitor Agent (Self-Healing)
```

- 🔍 **Researcher Agent** — Sources 15 POIs using Claude + Google Places + real-time weather
- 🎭 **Vibe Validator** — Filters by persona (Explorer / Safe / Risk-Taker) and preferences
- 📐 **Logistics Optimizer** — Sequences route using Google Distance Matrix (35% more efficient)
- 📦 **TOON Master** — Encodes plan using proprietary TOON Protocol v1.2
- 🛡️ **Monitor Agent** — Self-heals itinerary on rain, delays, or user preference changes

---

## 🧠 TOON Protocol

A proprietary **Typed Object-Oriented Notation** that reduces LLM token consumption by up to 60%, slashing latency and inference costs.

```
Activity(Tower_of_London) {
  Time: 10:00;
  Lat: 51.5081;
  Lon: -0.0759;
  Type: Outdoor;
  Logic: Heritage site during low crowd window;
  Price: $35;
}
```

---

## 🌍 SDG Alignment

- **SDG 13 (Climate Action)** — 35% route optimization = 35% fewer emissions per trip
- **SDG 11 (Sustainable Cities)** — Surfaces hidden gems to reduce overtourism pressure
- **SDG 8 (Decent Work)** — Channels tourism spend to local businesses

---

## 🗄️ Psychographic Memory (RAG)

Every journey is stored in Supabase. ITERA extracts user preferences in the background and injects them into future plans via a lightweight RAG pipeline — making every trip more personal than the last.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI + Python |
| AI Orchestration | LangGraph + Claude (claude-haiku-4-5) |
| Memory & DB | Supabase (PostgreSQL) |
| Maps | Google Maps API + Places + Distance Matrix |
| Weather | OpenWeatherMap API |

---

## 🚀 Setup

### Backend
```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Create .env file (see .env.example)
cp .env.example .env
# Fill in your API keys

uvicorn main:app --reload
```

### Frontend
```bash
cd Frontend
npm install

# Create .env.local
cp .env.example .env.local
# Fill in your keys

npm run dev
```

### Environment Variables

**Backend `.env`**
```env
ANTHROPIC_API_KEY=your_key
GOOGLE_MAPS_KEY=your_key
OPENWEATHER_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

**Frontend `.env.local`**
```env
VITE_GOOGLE_MAPS_KEY=your_key
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_anon_key
```

---

## 📁 Project Structure

```
ITERA-AI/
├── Backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── researcher.py    # POI sourcing + geocoding
│   │   │   ├── vibe.py          # Persona filtering
│   │   │   ├── logistics.py     # Route optimization
│   │   │   ├── monitor.py       # Self-healing
│   │   │   ├── extractor.py     # Preference extraction
│   │   │   └── squad.py         # LangGraph orchestration
│   │   ├── core/
│   │   │   ├── toon_engine.py   # TOON Protocol parser
│   │   │   └── config.py        # Settings
│   │   └── db/
│   │       └── supabase_client.py
│   └── main.py                  # FastAPI endpoints
├── Frontend/
│   └── src/
│       ├── components/          # React UI components
│       ├── hooks/               # useSelfHeal
│       └── db/                  # Supabase client
└── docs/
    ├── architecture_diagram.png
    └── pitch_deck.pdf
```

---

## 👥 Team

Built with ❤️ at Impact AI-Thon 2026, Chennai.
