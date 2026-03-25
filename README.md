<div align="center">

# 🧠 Break My Guard

**A fast-paced Human vs AI prompt battle game**

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)]()
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)]()
[![LLM](https://img.shields.io/badge/LLM-Game%20Logic-purple?style=for-the-badge)]()
[![Redis](https://img.shields.io/badge/State-Redis-red?style=for-the-badge&logo=redis)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)]()

> A web-first AI game where players must **break hidden model restrictions** using only clever prompting — combining reasoning, creativity, and time pressure in a competitive 1v1 format.

</div>

---

## 🏆 Challenge

> **Think you're good at prompt engineering?**
> **Can you break the AI before time runs out?**

- Can you break the AI in under 60 seconds?
- Can you do it without obvious tricks?
- Can you beat Hard mode consistently?

👉 Share your best prompts.

---

- ⏱️ Beat the AI in under 60 seconds  
- 🧠 Outsmart hidden restrictions  
- 🎯 Win without obvious tricks  
- 🔥 Master Hard mode consistently  

👉 **Play now:** https://breakmyguard.vercel.app/

---

## 📱 Features

### 🎮 Gameplay
- ⏱️ 60–75 second rounds of prompt battles  
- 🤖 AI operates under hidden restrictions  
- 🧩 Force a real slip without knowing the rule  
- 🎯 Dynamic difficulty (Medium → Hard)  
- 🧪 Dual-layer slip detection (rules + LLM validation)  
- 📊 Stats-only persistence (no chat logs stored)  

### 🔥 Why Play
- Skill-based prompt engineering  
- Fast replayability  
- Immediate feedback  
- Addictive game loop  

---

## 🧠 How It Works

1. A hidden restriction is generated server-side  
2. The AI must follow it without revealing it  
3. You try to manipulate, trick, or pressure the AI  
4. A dual validation system detects if the rule is broken  
5. You win if the AI slips — otherwise, the guard holds  

---

## 🎯 Game Mechanics

- Hidden rule generation (server-side)  
- Prompt-based attack system  
- Time pressure (60–75s)  
- Slip detection engine  
- Dynamic difficulty scaling  

---

## 🖥️ Screenshots

### 🟢 Landing Screen
![Landing Screen](./public/screenshots/Landing.png)

### 🟢 Match Selection
![Match Selection](./public/screenshots/Matching.png)

### 🟢 Prompt Battle
![Prompt Battle](./public/screenshots/Promptit.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js |
| Backend | Supabase |
| AI | LLM-based restriction enforcement & slip detection |
| State | Redis / In-memory |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## 🏗️ Architecture

Clean modular architecture:

```
app/                # App router pages
components/         # UI & game components
hooks/              # Game logic hooks
lib/                # Core AI + rules + validation
pages/api/          # Server APIs
migrations/         # Supabase schema
scripts/            # Utilities
```

- Server-only restriction generator  
- Ephemeral round state (no logs)  
- Real-time gameplay loop  
- Anti-spam protection  

---

## 🚀 Getting Started

### Prerequisites
- Node.js  
- Supabase project  
- Groq API key  

### Setup

```bash
git clone https://github.com/raahu1l/Breakmyguard.git
cd Breakmyguard
npm install
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

---

## 🔐 Privacy

- No chat logs stored  
- Only stats persisted  
- System prompts server-side only  
- Secure against prompt leakage  

---

## 💡 Why This Project Matters

Break My Guard explores:

- AI alignment & constraint enforcement  
- Prompt engineering under pressure  
- Real-time validation systems  
- Human vs AI interaction design  

This project is not just a game — it is an experiment in **AI behavior and control systems**.

---

## 🗺️ Roadmap

- [ ] UI polish  
- [ ] Leaderboards  
- [ ] Multiplayer modes  
- [ ] Mobile optimization  

---

Developed with the assistance of AI tools to accelerate development, debugging, and system design.

---

## 👨‍💻 Author

**Rahul Walawalkar**  
📧 walawalkarrahul729@gmail.com  
🔗 https://github.com/raahu1l  

---

<div align="center">

Built with ❤️ · Star ⭐ if you find it useful

</div>
