# Setup & Run

Prereqs:
- Git
- Node.js 18+ (for local dev)
- Docker & Docker Compose (for full-stack)

Quick start (Docker):
1. Clone:
   git clone https://github.com/Umakant98/trading-signal-platform.git
   cd trading-signal-platform

2. Copy env:
   cp .env.example .env
   Edit `.env` with any provider API keys.

3. Start stack:
   docker-compose up -d --build

4. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

Local dev (without Docker):

Backend:
cd backend
npm install
npm run dev   # or npm start after building

Frontend:
cd frontend
npm install
npm start
