# Universal Portfolio CMS — Phase 1

Database-driven site renderer + minimal admin. One codebase, any niche via Section JSONB config.

## Quick start

### 1. Database & Redis

```bash
docker compose up -d
```

Edit `backend/.env` if your Postgres credentials differ.

### 2. Backend

```bash
cd backend
venv\Scripts\activate
alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

API: http://localhost:8000 · Docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm run dev
```

- Home: http://localhost:3000  
- Demo site: http://localhost:3000/site/bright-smile-dental/home  
- Admin: http://localhost:3000/admin (password: `admin123` from `.env`)

## Architecture

- **Frontend** renders ordered `Section` rows by `type` (hero, about, services, testimonials, contact, footer). No hardcoded copy in renderers.
- **Backend** REST CRUD under `/api/*`; public read at `/api/public/{site_slug}/pages/{page_slug}`.
- **Admin** JWT from `POST /api/auth/login` (env `ADMIN_PASSWORD`).

## Demo flow

1. Open admin → Bright Smile Dental → Home → Edit hero headline → Save.  
2. Refresh the live site — change appears without redeploy.
