# Mini ERP + CRM Operations Portal

A lightweight ERP/CRM system for a wholesale/distribution company, covering customer management, product & inventory tracking, and a sales challan workflow with atomic stock deduction.

## Tech Stack

**Backend:** Node.js, TypeScript, Express.js, PostgreSQL (via Prisma ORM), JWT authentication, Zod validation, AWS S3 (image storage), PDFKit (invoice generation)
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
**Database:** PostgreSQL hosted on Neon (serverless Postgres)
**Deployment:** Vercel (frontend), Render (backend), Neon (database)

## Project Structure

```
mini-erp-crm/
├── backend/          # Express API, Prisma schema, business logic
│   ├── src/
│   │   ├── modules/  # auth, customers, products, stock, challans
│   │   ├── middleware/
│   │   └── utils/    # jwt, password hashing, S3 upload, PDF generation
│   ├── prisma/
│   └── Dockerfile
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── pages/    # customers, products, challans
│       ├── components/
│       ├── api/
│       └── context/
├── postman/          # API collection
├── .github/workflows/ # CI pipeline
└── docker-compose.yml
```

## Live Deployment

- **Frontend:** https://mini-erp-crm-azure-seven.vercel.app
- **Backend API:** https://mini-erp-crm-backend-uc5q.onrender.com
- **GitHub Repo:** https://github.com/allampalliritikh/mini-erp-crm

> Note: the backend is on Render's free tier, which spins down after inactivity — the first request after idle time may take up to ~50 seconds to respond while it wakes up.

## Local Setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. free tier on [Neon](https://neon.tech))
- An AWS account with an S3 bucket (only required for the image upload feature)

### Backend

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:
```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="a long random string"
JWT_EXPIRES_IN="1d"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_S3_BUCKET="your-bucket-name"
AWS_REGION="your-bucket-region"
```

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed      # creates 4 test users, one per role
npm run dev        # starts server on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

Fill in `.env`:
```
VITE_API_BASE_URL="http://localhost:5000"
```

```bash
npm install
npm run dev        # starts app on http://localhost:5173
```

### Running with Docker

A `docker-compose.yml` is provided for local containerized development against your existing Neon database:

```bash
# from the project root, with DATABASE_URL, JWT_SECRET etc. exported or in a root .env
docker compose up --build
```

Backend runs on port 5000, frontend (served via Nginx) on port 5173.

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | backend | Token expiry (e.g. `1d`) |
| `PORT` | backend | Port the API server runs on |
| `CORS_ORIGIN` | backend | Allowed frontend origin |
| `AWS_ACCESS_KEY_ID` | backend | IAM user access key for S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | backend | IAM user secret key for S3 uploads |
| `AWS_S3_BUCKET` | backend | S3 bucket name for product images |
| `AWS_REGION` | backend | AWS region of the S3 bucket |
| `VITE_API_BASE_URL` | frontend | Base URL of the backend API |

## Deployment Notes

- **Frontend** is deployed on Vercel, built from the `frontend/` directory with `VITE_API_BASE_URL` set to the live backend URL. A `vercel.json` rewrite rule serves `index.html` for all paths so client-side routing works on refresh/direct navigation.
- **Backend** is deployed on Render as a Node web service, root directory `backend/`, build command `npm install && npx prisma generate && npm run build`, start command `npm start`. Environment variables are configured in Render's dashboard, mirroring the `.env.example` file above.
- **Database** is a free-tier Neon Postgres instance; migrations are applied via `npx prisma migrate deploy` on backend startup (see `Dockerfile`) or manually via `npx prisma migrate dev` locally.
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `main`, building both the backend (TypeScript compile + Prisma generate) and frontend (Vite build) to catch build-breaking errors early.

## Test Login Credentials

All test users share the password `password123`.

| Role | Email |
|---|---|
| Admin | admin@erp.com |
| Sales | sales@erp.com |
| Warehouse | warehouse@erp.com |
| Accounts | accounts@erp.com |

## Architecture Overview

The backend follows a layered module structure (routes → controller → service → Prisma), with each business domain (auth, customers, products, stock, challans) isolated into its own folder. JWT-based authentication protects all API routes; role-based middleware (`requireRole`) restricts sensitive actions (e.g. only ADMIN/WAREHOUSE can create products; only ADMIN/SALES can manage challans).

The core business rule — confirming a sales challan — is implemented as a Prisma database transaction: it first validates that every item has sufficient stock, and only if all items pass does it deduct stock and write stock movement logs, preventing partial/inconsistent states. Challan line items store a snapshot of product name, SKU, and price at creation time, independent of later product changes.

Product images are uploaded via a Multer in-memory buffer, forwarded directly to an S3 bucket (no local disk storage), and the resulting public URL is saved on the product record. Challan invoices are generated on demand as PDFs using PDFKit, streaming the file directly to the client.

The frontend is a single-page React app using React Router for navigation, a shared Axios instance with an auth interceptor, and React Context for session state. UI is built with Tailwind CSS in a clean admin-panel style.

## Bonus Features Implemented

- ✅ Docker setup (`Dockerfile` for both backend and frontend, plus `docker-compose.yml`)
- ✅ GitHub Actions CI pipeline (build verification on every push/PR)
- ✅ Export challan/invoice as PDF
- ✅ Upload product image to AWS S3

## Assumptions

- Challan numbers are generated sequentially per year (`CH-<year>-<sequence>`) based on total challan count; this is simple and sufficient for the scope of this assignment but is not strictly safe under very high concurrent write load.
- "Simple JWT-based authentication" per the spec was used rather than session-based auth or refresh tokens.
- Role permissions were designed reasonably (e.g. WAREHOUSE can manage products/stock, SALES can manage customers/challans) since the spec did not fully define per-role permissions.
- Optional fields (email, GST number, business name, category, location) are omitted from the request payload when empty rather than sent as empty strings.
- A confirmed challan cannot be cancelled (since stock has already been deducted); reversing its effect is done via a manual stock adjustment with a documented reason, preserving a clean audit trail.

## Known Limitations

- No automated test suite (unit/integration tests) due to the assignment's time constraint.
- No AWS deployment for the app itself (used AWS only for S3 storage per the bonus feature; app hosting is on free-tier Vercel/Render/Neon).
- No Docker Hub image published — Dockerfiles are provided for local/self-hosted builds only.
- Challan number generation is count-based rather than using a dedicated atomic sequence/counter table.
