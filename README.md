# Billing App

Quotation generator for electrical businesses, built with React (Vite) on the frontend and an Express API that talks to Supabase for persistence. The project is now optimized for Vercel: the frontend is deployed as static assets and the API runs as a serverless function under `/api/*`.

## Features

- Professional quotation builder with PDF export
- Admin-authenticated workspace
- Brand, product and quotation management backed by Supabase Postgres
- Responsive design with Tailwind CSS
- Single-click Vercel deployment

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, html2pdf.js
- **Backend:** Express 4 running as a Vercel serverless function
- **Database:** Supabase Postgres + Storage (via `backend/billing-app-setup.sql`)

## Prerequisites

- Node.js 18+
- Supabase project with API URL and anon key
- Vercel account (for production deployment)

## Local Development

```bash
# install all dependencies
npm install

# copy backend environment variables
cp backend/env.example backend/.env
# edit backend/.env with your Supabase credentials and JWT secret

# optional: seed Supabase using the SQL in backend/billing-app-setup.sql

# run frontend + backend concurrently
npm run dev
```

Useful scripts:

- `npm run server` – backend only (Express + nodemon)
- `npm run client` – frontend only (Vite dev server)
- `npm run build` – creates the production frontend bundle (`frontend/dist`)
- `npm run test-connection` – quick Supabase health check

## Environment Variables

Create `backend/.env` (Vercel → Project Settings → Environment Variables uses the same keys):

```
SUPABASE_URL=https://jqmfzcvbjgmjyjgptydv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbWZ6Y3ZiamdtanlqZ3B0eWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTQyMDUsImV4cCI6MjA3NjkzMDIwNX0.75WDmjz6DBALdshXtWlbLwyJof3DQeGTPlu2Kz5ks_8
JWT_SECRET=0f0b29cfe4996e5de4246d67c20923ba1b4498e5ac2d8787f7d93c6a
FRONTEND_URL=http://localhost:5173
```

## Deploying to Vercel

1. Push your code to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Set the same values in your Vercel project (copy/paste the Supabase URL, anon key, and JWT secret above; adjust `FRONTEND_URL` to your deployed domain later).
4. Vercel will run:
   - `npm install` (installs root + backend dependencies)
   - `npm run install:all` (installs frontend/backend node_modules)
   - `npm run build`
   - Bundle `api/index.js` as the serverless Express API.
5. The frontend is published from `frontend/dist`; all `/api/*` requests are routed to the Express app.

That’s it—no additional render/docker scripts are required.

## File Structure

```
billing-app/
├── api/
│   └── index.js          # Vercel serverless entrypoint (Express app)
├── backend/
│   ├── app.js            # Express app definition shared by server + Vercel
│   ├── server.js         # Local dev server
│   ├── billing-app-setup.sql
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json          # root tooling + shared dependencies
├── package-lock.json
└── vercel.json           # Vercel deployment config
```

## Supabase Setup

Run the SQL in `backend/billing-app-setup.sql` inside the Supabase SQL Editor. It will:

- Create `admins`, `brands`, `products`, and `quotations` tables with the column names expected by the frontend.
- Insert the default admin user (`AyeshaEle` / `Afaanreyo`).
- Populate sample brands and products.
- Refresh the schema cache.

## Testing the Data Layer

```
npm run test-connection
npm run test-bill-saving
```

Both scripts rely on the Supabase environment variables and confirm that the database schema matches the application expectations.

## License

MIT © 2025