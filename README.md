# QuickPoll Frontend (Client)

Vite + React frontend for QuickPoll with real-time updates via Server‑Sent Events (SSE).

## Stack
- Vite + React 18
- EventSource (SSE) for live updates
- Fetch API for REST calls

## Requirements
- Node.js 18+
- Backend running (see server)

## Setup
1. Install dependencies: `npm install`
2. Create an environment file:
   - Copy `.env.example` to `.env`

### Environment variables
```
VITE_API_URL=http://localhost:4000
```

## Run
- Development: `npm run dev` → http://localhost:5173
- Build: `npm run build`
- Preview build: `npm run preview`

## How it works
- On load, fetches polls from `GET {VITE_API_URL}/api/polls`
- Subscribes to `EventSource({VITE_API_URL}/api/stream)`
  - Handles events: `pollCreated`, `pollUpdated`, `pollLiked`
- Actions
  - Create Poll → `POST /api/polls`
  - Vote → `POST /api/polls/:id/vote`
  - Like → `POST /api/polls/:id/like`

## Troubleshooting
- No live updates:
  - Check Network tab: `api/stream` should be open (pending)
  - Ensure backend `CLIENT_ORIGIN` allows `http://localhost:5173`
- API errors:
  - Confirm `VITE_API_URL` in `.env`
  - Verify backend is running and reachable
