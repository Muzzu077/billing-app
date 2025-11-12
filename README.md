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
# install all workspace dependencies
npm install

# copy backend environment variables
cp backend/env.example backend/.env
# edit backend/.env with your Supabase credentials and JWT secret

# optional: seed Supabase using the SQL in backend/billing-app-setup.sql

# run frontend + backend concurrently
npm run dev
```

Useful workspace scripts:

- `npm run server` – backend only (Express + nodemon)
- `npm run client` – frontend only (Vite dev server)
- `npm run build` – creates the production frontend bundle (`frontend/dist`)
- `npm run test-connection --workspace backend` – quick Supabase health check

## Environment Variables

Create `backend/.env` (Vercel → Project Settings → Environment Variables uses the same keys):

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
JWT_SECRET=<any-random-string>
FRONTEND_URL=http://localhost:5173
```

## Deploying to Vercel

1. Push your code to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Set the environment variables listed above in the Vercel project.
4. Vercel will run:
   - `npm install` (installs workspaces)
   - `npm run build --workspace frontend`
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
├── package.json          # npm workspaces + dev scripts
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
npm run test-connection --workspace backend
npm run test-bill-saving --workspace backend
```

Both scripts rely on the Supabase environment variables and confirm that the database schema matches the application expectations.

## License

MIT © 2025