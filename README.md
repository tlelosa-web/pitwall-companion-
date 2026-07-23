# F1 Clash Resource Sheet

An **offline-first**, phone-installable Progressive Web App (PWA) for tracking
your **F1 Clash** driver and component **levels** and **card counts**. It turns
the community *F1 Clash 2026 Resource Sheet (v1.0 by TR The Flash)* into a
living tracker you can update on the go.

- 📴 **Works fully offline** after the first load (service worker precache).
- 📱 **Installable** to your home screen on Android and iOS; runs standalone.
- 🔒 **All data stays on your device** — nothing is sent anywhere, no accounts,
  no analytics, no network calls at runtime.
- ⚙️ **No build step, no framework, no server** — just static files.

> Unofficial fan tool. Not affiliated with F1, Formula 1, or Hutch Games.

## Features

- **Drivers** tab grouped by rarity (Common, Rare, Epic, Legendary) and a
  **Components** tab grouped by category (Front Wing, Brakes, Suspension, Rear
  Wing, Gearbox, Engine, Battery).
- Each card shows a **rarity badge**, a **Level** with −/+ steppers, an
  **editable card count**, and a **progress bar toward the next level** (or
  **★ MAX** when the card is at its rarity cap). The bar label shows the
  **coin cost** to the next level alongside the card cost.
- **Stats & costs** panel per card (tap to expand): the card's per-level stats
  (drivers: Overtaking / Defending / Qualifying / Race Start / Tyre Use;
  components: Speed / Cornering / Power Unit / … as applicable), its
  **Total Value** and **Team Score**, and the **cards + coins remaining to
  reach max**.
- **Collection "to max" summary** at the top of each tab: total cards left,
  total coins left, and how many cards are already maxed.
- **Search** by name and **filter chips** (All + each group of the active tab).
- **Export** / **Import** a JSON backup, and **Reset** to the built-in defaults.
- **Dark mode by default**, honoring `prefers-color-scheme`.

### Reference data (stats & coin costs)

Per-level **stats** and **coin/card upgrade costs** are baked into the app from
the *F1 Clash 2026 Resource Sheet* (v1.1 reference tables). This covers **all
88 driver cards** and the **11 components** for which the source sheet publishes
detailed stats (Front Wing, Brakes, Gearbox, Engine, Battery entries). Other
components still track level and card count and show a correct **cards-to-max**
figure (that's pure math from the cost table), but their per-level stats and
coin costs are shown as unavailable until the source sheet adds them.

> **Cards-to-max** works for every card. **Coins-to-max** and **stats** appear
> wherever the source sheet has published the numbers.

### Rules used for progress

```js
// cards needed to reach the NEXT level, keyed by current level
const COST = {1:4,2:10,3:20,4:50,5:100,6:200,7:400,8:1000,9:2000,10:4000,11:8000};
// max level per rarity
const CAP  = {Common:11, Rare:9, Epic:7, Legendary:5};
```

Progress toward the next level is `min(amount / COST[level], 1)`; at
`level >= CAP[rarity]` the card shows **★ MAX** instead of a bar.

## Run locally

Because a service worker is used, open the app over `http://` rather than a
`file://` path. From the repo root:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000/
```

Any static file server works. First load caches everything; after that you can
go offline and it keeps working.

## How your data is stored

- Everything lives in `localStorage` under the key **`f1sheet.v1`**.
- Only values you **change** are stored (as *overrides* keyed by card id), so
  future seed-data updates still flow through to cards you haven't touched.
- A `schema` field is stored for safe future migrations.
- Card id format: `d:<Rarity>:<Name>` for drivers, `c:<Category>:<Name>` for
  components.

Use **Export** to save a JSON backup and **Import** to restore it on another
device or after clearing browser data.

## Deploy to GitHub Pages

1. Commit all files to the repo **root**.
2. **Settings → Pages → Build and deployment → Deploy from a branch →
   `main` / `(root)`**.
3. Keep the **`.nojekyll`** file present so Pages serves paths verbatim
   (otherwise files/folders starting with `_` and some paths can be skipped).
4. The app uses **relative URLs** and registers the service worker with a
   relative path, so it works correctly under `https://<user>.github.io/<repo>/`.

> Private repos need **GitHub Pro** to publish Pages. Otherwise make the repo
> public, or host the folder on any static host (Netlify, Cloudflare Pages, an
> S3 bucket, etc.) — no server-side code is required.

## Cache-busting when you change a file

The service worker precaches the app for offline use. **Whenever you change any
cached file** (`index.html`, `sw.js`, `manifest.webmanifest`, or an icon),
bump the single version constant at the top of `sw.js`:

```js
const CACHE_VERSION = "f1sheet-v1";   // -> "f1sheet-v2", etc.
```

On the next visit the service worker installs the new cache and deletes the old
one, so users get the updated files instead of a stale copy.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup + inline CSS + inline JS (with seed data). |
| `sw.js` | Service worker: precache + offline navigation fallback. |
| `manifest.webmanifest` | PWA manifest (standalone, icons, theme colors). |
| `icons/icon-192.png`, `icon-512.png` | App icons (512 also serves as maskable). |
| `icons/apple-touch-icon.png` | 180×180 icon for iOS home screen. |
| `.nojekyll` | Tells GitHub Pages to serve paths verbatim. |

## Credits

Seed data from the community **F1 Clash 2026 Resource Sheet v1.0** by
**TR The Flash**. Legendary driver values reflect the sheet defaults.
