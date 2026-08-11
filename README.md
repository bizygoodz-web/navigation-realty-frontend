# Navigation Realty — Frontend

A single React (Vite) app containing all five screens built so far:
agent login/signup, the Agent Dashboard, client portal login, and both
the Buyer and Seller portals — wired together with real routing and
pointed at the live backend.

## Routes

| Path | Screen |
|---|---|
| `/login` | Agent login/signup |
| `/dashboard` | Agent Dashboard (requires agent login) |
| `/portal/login` | Client portal login |
| `/portal/buyer` | Buyer Portal (requires client login) |
| `/portal/seller` | Seller Portal (requires client login) |

Login state is a token in `localStorage` (`realtyflow_agent_token` /
`realtyflow_client_token`) checked by simple route guards in `src/App.jsx`.
This is enough to develop and demo against — for production, swap in an
actual auth context that validates the token against the API rather than
just checking it exists, and add a real "log out" action (there isn't one
wired up yet).

**One thing worth knowing:** after client login, everyone is currently
routed to `/portal/buyer` — there's no logic yet that checks whether a
given contact is a buyer or a seller and sends them to the right one. Wire
that from `GET /portal/me`'s `contact_type` field once you're testing with
real accounts of both types.

## Local development

```
npm install
npm run dev
```

Uses `/api` as the API base URL in dev by default (see `.env.example`) —
set `VITE_API_URL` in a `.env.local` file to point at your live backend
instead, e.g.:

```
VITE_API_URL=https://realtyflow-crm-2.onrender.com
```

## Building for production

```
npm run build
```

Outputs static files to `dist/` — `VITE_API_URL` is baked in at build
time from `.env.production` (already set to your live Render backend).
If your backend URL changes, update `.env.production` and rebuild.

## Deploying (Vercel, recommended)

1. Push this folder to its own GitHub repo (same process as the backend —
   use Git Bash, not the GitHub website uploader, since that dropped
   subfolders like `app/` and `migrations/` for the backend earlier).
2. On vercel.com: New Project → import that repo. Vercel auto-detects Vite.
3. Framework Preset: Vite. Build Command: `npm run build`. Output
   Directory: `dist`. These are Vercel's defaults for a Vite project, so
   you likely won't need to touch them.
4. Add `VITE_API_URL` under Environment Variables with your Render backend
   URL, so it's not just relying on the committed `.env.production`.
5. Deploy. Vercel gives you a `https://your-project.vercel.app` URL.

## CORS

The backend's `main.py` currently allows all origins (`allow_origins=["*"]`)
so this will work from any Vercel URL out of the box. Before going further
than a demo, tighten that to your actual frontend domain(s) specifically.
