# AI-Driven-Tourism-Agent# ITERA — Plan Less. Experience More ✨

## The Self-Healing Travel Intelligence 🌍

**"Every travel tool answers questions. ITERA makes decisions — and learns from every trip to make the next one better."**

🏆 Built for **Impact AI-Thon 2026** | Track 2: Climate & Compass | St. Joseph's College of Engineering

---

# 🌍 The Problem

Planning a trip today means opening multiple platforms — Google, TripAdvisor, Booking, Maps, Weather — spending hours, and still ending up with a rigid plan that breaks the moment reality changes (rain, delays, closures).

This is the **Planning Tax**. Every traveler pays it.

---

# ✨ What ITERA Does Differently

ITERA is not a search tool. It is a **decision-making system** powered by multiple AI agents that collaborate, optimize, and self-heal itineraries in real time.

| Feature                       | ITERA | Google Travel | ChatGPT |
| ----------------------------- | ----- | ------------- | ------- |
| Multi-agent orchestration     | ✅     | ❌             | ❌       |
| Real-time self-healing        | ✅     | ❌             | ❌       |
| Psychographic memory (RAG)    | ✅     | ❌             | ❌       |
| Road-aware route optimization | ✅     | ✅             | ❌       |
| Gets smarter every trip       | ✅     | ❌             | ❌       |

---

# 🤖 The Agent Squad

```
User Input → Researcher → Vibe Validator → Logistics Optimizer → TOON Master → Itinerary
                                                                        ↑
                                                              Monitor Agent (Self-Healing)
```

🔍 **Researcher Agent**
Sources POIs using Claude, Google Places, and real-time weather.

🎭 **Vibe Validator**
Filters activities based on traveler persona (Explorer / Safe / Risk-Taker).

📐 **Logistics Optimizer**
Optimizes routes using Google Distance Matrix.

📦 **TOON Master**
Encodes itinerary using the proprietary **TOON Protocol v1.2**.

🛡️ **Monitor Agent**
Continuously monitors conditions and self-heals plans when disruptions occur.

---

# 🧠 TOON Protocol

A proprietary **Typed Object-Oriented Notation** that reduces token usage and latency.

Example:

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

# 🗄️ Psychographic Memory (RAG)

Each trip is stored in Supabase. ITERA extracts user preferences and reinjects them into future planning using a lightweight RAG pipeline, improving personalization over time.

---

# 🌱 SDG Alignment

**SDG 13 – Climate Action**
Route optimization helps reduce travel emissions.

**SDG 11 – Sustainable Cities**
Promotes lesser-known locations to reduce overtourism.

**SDG 8 – Decent Work**
Supports local businesses through smarter discovery.

---

# 🛠️ Tech Stack

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Frontend         | React + Vite + Tailwind CSS                |
| Backend          | FastAPI + Python                           |
| AI Orchestration | LangGraph + Claude                         |
| Database         | Supabase (PostgreSQL)                      |
| Maps             | Google Maps API + Places + Distance Matrix |
| Weather          | OpenWeatherMap API                         |

---

# 🚀 Setup

## Backend

```
cd Backend

python -m venv venv

# Activate environment
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your API keys

uvicorn main:app --reload
```

---

## Frontend

```
cd Frontend

npm install

# Create environment file
cp .env.example .env.local

# Add your API keys

npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```
ANTHROPIC_API_KEY=
GOOGLE_MAPS_KEY=
OPENWEATHER_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Frontend (.env.local)

```
VITE_GOOGLE_MAPS_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

---

# 📁 Project Structure

```
ITERA-AI/
├── Backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── researcher.py
│   │   │   ├── vibe.py
│   │   │   ├── logistics.py
│   │   │   ├── monitor.py
│   │   │   ├── extractor.py
│   │   │   └── squad.py
│   │   ├── core/
│   │   │   ├── toon_engine.py
│   │   │   └── config.py
│   │   └── db/
│   │       └── supabase_client.py
│   └── main.py
│
├── Frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── db/
│
└── docs/
    ├── architecture_diagram.png
    └── pitch_deck.pdf
```

---
 ## 👥 Team 

Built with ❤️ at **Impact AI-Thon 2026, Chennai**
