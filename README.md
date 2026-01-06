# Vista360 NG – Pilot 360° Marketplace

Vista360 NG is a **pilot web app** to demo the core idea of a Nigerian 360° virtual tour marketplace:

- Grid of 360° tours (properties, hotels, venues) similar to Kuula’s explore page.
- Each tour has its **own page** with an embedded 360° walkthrough (currently via Kuula iframe).
- Simple **Vista360 TV** page to show vlog embeds.
- Light **categories** page (hotels, events, luxury, land).
- Backend is minimal: Node.js + Express serving static files and a small JSON API.

This pilot is **NOT** a full product.  
Focus: a clean visual demo, fast loading, and very small codebase (easy to reason about, cheap to host).

---

## 1. Tech Stack (Pilot Only)

- **Runtime:** Node.js (LTS)
- **Server:** Express
- **Frontend:** Plain HTML + CSS + vanilla JS (no React/Angular/Vue in the pilot)
- **Hosting of 360 tours:** External (e.g. Kuula) embedded with `<iframe>`
- **Database:** None yet – JSON files stored in `data/` for persistence
- **Auth / Payments:** Minimal admin auth (cookie/header), no user auth or payments yet

> Important: Please **do not introduce heavy frameworks** or complex auth, DB layers, or build pipelines at this stage. The goal is clarity, not sophistication.

---

## 2. Project Structure

```text
vista360-pilot/
├─ server.js          # Express server (single file)
├─ README.md          # This file
└─ public/
	├─ index.html      # Marketplace home (grid + hero + categories + vlog teaser)
	├─ tour.html       # Single tour page with 360 iframe + WhatsApp CTA
	├─ vlog.html       # Vista360 TV (YouTube vlog embeds)
	├─ categories.html # Simple list of cities/categories
	└─ styles.css      # All styling
```

**Routes:**

- `GET /` → `public/index.html`
- `GET /tour/:id` → `public/tour.html` (tour selected via JS using the `id`)
- `GET /vlog.html` → Vista360 TV page
- `GET /categories.html` → Categories page
- `GET /api/tours` → JSON list of sample tours (used by `index.html` to render cards)

## Deployment & Hosting (quick notes)

See `DEPLOY.md` for concise guidance on free tools (Cloudflare, Netlify/GitHub Pages, Firebase, Marzipano/A-Frame) and low-cost paid options (Backblaze B2, Vercel Pro, Namecheap). Also includes a recommended quickstart workflow to go from prototype to hosted site.

## Mockup

An auto-generated PNG mockup of the homepage is available at `artwork/homepage-mockup.png` (generated with Puppeteer).

## Visual regression CI

This repository includes a visual regression test that captures the homepage at desktop, tablet, and mobile sizes using Puppeteer and compares images with pixelmatch. Baseline images are stored in `__tests__/baseline/` and are checked into the repo so CI can compare against them. To update baselines after intentional visual changes, run `npm run screenshot` and `npm run visual:update-baseline` and commit the updated files. The workflow runs on push and pull requests and will upload artifacts and the homepage mockup for preview.

## How to push & preview

1. Add a remote and push this branch:

   - git remote add origin git@github.com:<your-org-or-username>/<repo>.git
   - git push -u origin feature/visual-preview

2. Create a pull request (GitHub web UI, or use GitHub CLI):

   - gh pr create --base main --head feature/visual-preview --title "Visual regression & preview setup" --body "Adds visual tests, baselines, homepage mockups, and CI to upload preview artifacts." --draft

3. On the PR, the **Visual regression** workflow will run and upload `artwork/` and `__tests__/baseline/` artifacts (these contain the generated screenshots and diffs).

4. To get a live preview hosted on GitHub Pages after merging to `main`: ensure the repository has Pages enabled; the `pages-deploy` workflow will publish the static `public/` folder automatically.

If you'd like, I can attempt to push and create the PR for you — provide the repository URL or give me push permissions. Otherwise, push & open the PR and I can help review and iterate on comments.

---

## 3. Concept Overview (for AI assistants and future devs)

### 3.1 What This Pilot Is Demonstrating

1. **Marketplace Grid UI**

	- Looks like a Kuula explore grid: multiple 360° cards with basic stats (views, city, category, price).
	- Cards link to `/tour/:id`.

2. **360° Tour Experience**

	- Each tour page embeds an external 360° viewer via `<iframe>` (currently Kuula).
	- Tour data (title, description, Kuula URL) are stored in small JSON files under `data/` and read by the server.

3. **Content & Brand Layer**

	- Vista360 TV (vlog page) shows YouTube embeds, proving content + tours live together.
	- Categories page shows how listings will be grouped (Hotels, Event Venues, Luxury Estates, Land/Development).

4. **Future Direction (not built now)**

	- Replace JSON data with a DB.
	- Replace Kuula iframe with our own 360 viewer.
	- Add agent/business dashboards, auth, and payments.

### 3.2 What This Pilot Should *Not* Do

- No complex admin panel, only a **simple `/admin` HTML** for admin actions.
- No user accounts, role‑based access, or payment forms yet.
- No extra heavy dependencies unless strictly required for basic functionality.

---

## 4. Setup Instructions

1. **Install dependencies**

	```powershell
	npm install
	```

2. **Run the server**

	```powershell
	node server.js
	```

3. **Open in browser**

	- Visit: http://localhost:3000
	- Click a card → opens `/tour/:id`
	- Visit `/vlog.html` for vlogs
	- Visit `/categories.html` for categories

If you add a simple `/admin` page:

- Create `public/admin.html`
- The server already serves `/admin` (if present). Visit http://localhost:3000/admin to manage tours and contact.

---

## 5. Guidelines for VS Code + AI Assistance

When using VS Code and any built‑in AI coding assistance, follow these prompts and constraints:

### 5.1 Recommended Prompt Pattern

Use short, focused prompts like:

- “**In `server.js`, add a new tour object for a hotel in Abuja. Keep same structure as existing tours.**”
- “**In `index.html`, add a new section below the grid that lists three bullet points explaining what Vista360 NG is. Keep styling consistent with existing CSS.**”
- “**In `styles.css`, slightly improve the card hover state without changing layout or introducing new fonts.**”

Avoid broad prompts like “rewrite the frontend” or “rebuild this with React”.

### 5.2 Boundaries for Changes

- Keep **single‑file server** (`server.js`) – do not split into multiple routers yet.
- Do not add heavy front‑end frameworks (React, Vue, Angular).
- Prefer **small, targeted changes** over large refactors.
- Respect existing class names and structure (`.card`, `.grid`, `.topbar`, `.hero`, etc.).

### 5.3 Performance & Credit‑Limit Constraints

To keep AI suggestions fast and cheap:

- Work on **one file at a time**.
- Ask for **small diffs**, e.g. “add one more tour card” instead of “redesign UI”.
- Don’t request full rewrites of `server.js` or `styles.css` unless absolutely necessary.

---

## 6. How to Add New Tours (Manual Process)

To add a new tour:

1. Open `data/tours.json` and add a new object with the same fields as existing tours.
2. Restart the server and refresh the browser.

---

## 7. Visual Direction

The UI should loosely follow **marketplace UI best practices**:

- Clear top navigation with 2–3 primary links.
- Hero section with a simple tagline and search bar.
- Card grid layout, responsive down to mobile.
- Minimal color palette and typography to keep it readable.

---

## 8. Roadmap Notes (for later)

- Swap in real data from Abuja pilots (Maitama Castle, Kado Estate, Sheritti land).
- Connect WhatsApp CTAs to real phone numbers.
- Add simple analytics (page views) if/when needed.
- Only after pilot success: consider moving to a framework (React) and proper DB.

---

If you'd like, I can also add example thumbnails and sample vlog IDs to the `vlog.html` page, or wire the category links to filter the grid on the homepage. Tell me which one you prefer.
