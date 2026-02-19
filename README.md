# AI Capability Atlas - Gamified Learning Module

A complete gamified learning experience for mastering AI capabilities. Built using an 8-agent pipeline.

## 🎓 Overview

Navigate 3 core domains, climb the skill ladder from Novice to Proficient, and unlock achievements as you learn.

## 🌐 Live Demo

**https://unnamedmistress.github.io/ai-capability-games/**

## 🎮 Features

### 3 Core Domains
- **Knowledge & Learning** (📚) - Understanding mode
- **Creativity & Content** (✨) - Generative mode  
- **Analysis & Problem Solving** (🧩) - Analytical mode

### Skill Ladder (Dreyfus-aligned)
- 🌱 **Novice** → ⚔️ **Competent** → 👑 **Proficient**

### Game Mechanics
- **Points System:** Earn points for correct answers, streaks, speed, completions
- **5 Badge Tiers:** Novice → Explorer → Practitioner → Expert → Master
- **3-Act Quests:** Foundation → Domain Mastery → Integration Challenge
- **Interactive Skill Tree:** D3.js visualization
- **Adaptive Assessment:** 4-question quiz with scoring

## 🏗️ How It Was Built

This module was created using the **Gamified Learning Skill** with 8 specialized agents:

| Phase | Agent | Output |
|-------|-------|--------|
| 1 | Content Agent | Lesson content + glossary |
| 1 | Pedagogy Agent | Learning objectives + sequence |
| 1 | UX/Game Agent | Points, badges, quests |
| 1 | Analytics Agent | xAPI + KPIs |
| 2 | Assessment Agent | 4 MCQs |
| 2 | Personalization Agent | Adaptive rules |
| 3 | Moderation Agent | Content review ✓ |
| 4 | QA Agent | Final validation (90% confidence) ✓ |

## 🚀 Quick Start

Open `index.html` in any modern browser:
```bash
# Serve locally
python3 -m http.server 8000
# Or open directly
open index.html
```

## 📊 Analytics

- xAPI statements for learning tracking
- KPIs: 75% completion target, 80% accuracy target
- Progress persistence via localStorage

## 📝 Content Structure

```
AI Capability Atlas/
├── Introduction - Why AI literacy matters
├── Section 1 - 3 Core Domains
├── Section 2 - Skill Ladder (Dreyfus)
├── Section 3 - Cognitive Skills Hierarchy
├── Section 4 - Capability Stack
├── Section 5 - Dependency Map
├── Glossary - 6 key terms
└── Assessment - 4 MCQs
```

## 🎨 Tech Stack

- React 18 (vanilla JS, no build step)
- Tailwind CSS (via CDN)
- D3.js for skill tree visualization
- localStorage for progress persistence

## 📄 License

MIT License
