# Project folder structure

Suggested minimal layout for the pilot:

- `vista360-pilot/`
  - `server.js` — Express server (backend)
  - `package.json` — scripts for backend and optional frontend
  - `.gitignore`
  - `README.md`
  - `data/` — JSON files stored by the backend at runtime (`tours.json`, `config.json`)
  - `public/` — static frontend (index.html, tour.html, admin.html, styles.css)
  - `frontend/` — optional Angular full SPA (if you choose to create one with `ng new`)
  - `.vscode/` — recommended workspace settings and extensions

Files required to show the pilot quickly:
- `public/index.html`, `public/tour.html`, `public/styles.css`, `server.js`.

If you want a *full Angular* client, put it in `frontend/` and use the `client:*` scripts in `package.json`.
