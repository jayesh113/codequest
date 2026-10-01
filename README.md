# ⚔️ CodeQuest — Gamified Coding Academy & Student Community Platform

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CodeQuest** is a modern, responsive web platform designed for student developer communities. It seamlessly combines a **developer academy**, an **online code judge**, a **gamified learning environment** (XP, progressive levels, streaks, badges, leaderboards), and an **administrative instructor command center**.

---

## 🌟 Key Highlights & Features

### 1. Motivation-Driven Student Dashboard
The student dashboard answers the three most important learning questions:
- 🎯 **What should I do today?** — Displays the daily objective goal widget (*"Complete 2 tasks: 1/2 Done (+100 XP)"*) and curated daily tasks with status pills.
- 📚 **What should I learn next?** — Recommends the next lesson in your active track (e.g., *Python Mastery: Lists & Tuples*) with progress tracking.
- 📊 **How much progress have I made?** — Highlights your current Level, progressive XP bar (*720 / 1000 XP*), active Streak (*🔥 12 Day Streak*), problems solved, tasks finished, and community rank.

### 2. Comprehensive Curriculum & Online Judge
- **5 Structured Learning Paths**: Python Mastery, Data Structures & Algorithms, Modern Web Development, React Frontend Mastery, and Backend & API Engineering (45 total modules with progressive milestone unlocks).
- **Resource Library**: Searchable and multi-filterable by type (*PDF, Video, Article, Notes, Code*), topic, and difficulty with an in-modal reader and *"Mark as Completed (+25 XP)"*.
- **Interactive Task System**: 4 status states (*NOT STARTED*, *IN PROGRESS*, *SUBMITTED*, *COMPLETED*), solution code editor, and anti-farming protection.
- **Online Judge & Sandboxed IDE**: In-browser code editor supporting **Python 3**, **JavaScript (Node.js)**, **C**, and **C++ (MinGW GCC)** with a custom stdin runner and test case verification.
- **Interactive Quizzes**: Timed multiple-choice assessments with real-time countdown, score percentage, detailed answer explanations, and instant XP reward.

### 3. Gamification Engine
- **XP Ledger & Auto-Leveling**: Centralized transaction history preventing duplicate XP farming with progressive level curves.
- **Streak System**: 28-day activity heatmap calendar and streak milestone bonuses at 3, 7, 14, and 30 days.
- **15 Badges & Achievements**: Real-time tracking for milestones such as *First Step*, *Python Beginner*, *Century*, *Consistent Coder*, and *Algorithm Ace*.
- **Leaderboard**: Filterable by *Weekly*, *Monthly*, and *All-Time* with podium medals (🥇, 🥈, 🥉) and highlighted student rows.

### 4. Admin & Instructor Command Center
- **Live Cohort Metrics**: Total students, active students, resources, tasks, challenges, and total community XP.
- **Analytics Charts**: 7-day activity velocity and student level distribution.
- **Creation Tools**: Modals to **Add Resources** (file upload / URL), **Create Tasks**, and **Post Announcements**.
- **Student Management**: Grant or deduct student XP (+/-) with custom feedback notes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API Sound Synthesizer.
- **Backend**: Node.js v22, Express.js REST API, JWT Authentication, Bcrypt password hashing, Multer file uploads.
- **Database**: MongoDB with Mongoose ORM, plus an automated in-memory document store with auto-persistence (`data/store.json`) for zero-configuration instant setup.
- **Execution Sandbox**: Subprocess runner supporting Python 3, Node.js, and MinGW GCC with strict timeout and buffer limits.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Optional: Python 3 and GCC (for local code judge execution)

### 1. Clone the repository
```bash
git clone https://github.com/jayesh113/codequest.git
cd codequest/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
npm start
```

Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Student** | `student@codequest.dev` | `password123` | Student Dashboard, Tasks, Arena, Quizzes, Profile |
| **Instructor / Admin** | `admin@codequest.dev` | `password123` | Instructor Panel, Stats, Student XP Adjustment, Resource Creator |

*(Quick 1-click login buttons are also provided on the login page for convenience)*

---

## 📂 Project Structure

```
codequest/
├── backend/
│   ├── config/db.js               # Resilient Mongoose & Store engine
│   ├── models/index.js            # 17 MongoDB Collections & Schemas
│   ├── middleware/                # JWT Auth & Multer Uploads
│   ├── services/
│   │   ├── codeRunner.js          # Sandboxed Python 3, Node JS, MinGW GCC Runner
│   │   └── gamificationService.js # Centralized XP, Levels, Streaks & Badges
│   ├── controllers/               # 9 REST controllers
│   ├── routes/api.js              # Consolidated API router
│   ├── seed/                      # Complete realistic seed dataset
│   ├── data/store.json            # Auto-persisted database
│   ├── public/                    # Frontend SPA delivered statically
│   │   ├── index.html             # Shell with Tailwind CDN & fonts
│   │   ├── app.css                # Glassmorphism & cyber glow styling
│   │   ├── sound.js               # Web Audio API Sound Synthesizer
│   │   ├── api.js                 # Frontend API client
│   │   ├── icons.js               # Crisp SVG Lucide icon set
│   │   ├── components/            # Navbar, Sidebar, MobileNav, Modals
│   │   ├── views/                 # 12 comprehensive pages
│   │   └── app.js                 # State orchestrator & router
│   └── server.js                  # Express bootstrapper
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).