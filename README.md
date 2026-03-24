# BeeTrack API - Vehicle Shipping & Tracking (Backend)

Overview
- Multi-tenant backend (Organizations)
- Role-based access control (SuperAdmin/Admin/Dispatcher/Driver/Customer/FleetManager)
- JWT access + refresh tokens (persisted, rotating)
- Tracking ingest & Socket.IO real-time updates
- Google Maps integration (geocoding, distance/ETA)
- Validation with Zod, structured logging with pino
- Dockerized and CI-ready

Quickstart (local)
1. Copy `.env.example` to `.env` and set variables (MONGO_URI, JWT_SECRET, GOOGLE_MAPS_API_KEY).
2. Install: `npm ci`
3. Run: `npm run dev`
4. Default server: http://localhost:4000

Docker
- `docker-compose up --build`

What’s included
- src/ (full TypeScript source)
- Dockerfile, docker-compose.yml
- GitHub Actions CI skeleton
- Basic tests scaffold

Notes
- Do NOT commit real secrets. Use environment variables or a secrets manager.
- For production consider: TLS termination, secrets manager, Redis + BullMQ for background jobs, Sentry for error tracking, monitoring (Prometheus/Grafana), and horizontal scaling for Socket.IO.
