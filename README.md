# Mini ERP + CRM Operations Portal

TODO: one-line project description.

## Tech Stack
- Backend: Node.js, TypeScript, Express, PostgreSQL, Prisma, JWT
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Deployment: Vercel (frontend) / Render (backend) / Neon (DB)

## Project Structure
TODO: brief structure overview (link to folders).

## Local Setup

### Backend
```
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

### Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables
TODO: table of each env var and what it's for.

## Deployment
TODO: steps taken to deploy frontend/backend/db, with live URLs.

## Test Login Credentials
| Role      | Email | Password |
|-----------|-------|----------|
| Admin     | TODO  | TODO     |
| Sales     | TODO  | TODO     |
| Warehouse | TODO  | TODO     |
| Accounts  | TODO  | TODO     |

## Architecture Overview
TODO: short explanation of module boundaries, auth flow, challan-confirm stock logic.

## Assumptions
TODO: list assumptions made during implementation.

## Known Limitations
TODO: list incomplete or simplified parts.
