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

- Five tabs: **Drivers**, **Parts** (components), **Tools**, **Season**, and
  **Rewards**.
- **Drivers** tab grouped by rarity (Common, Rare, Epic, Legendary) and a
  **Parts** tab grouped by category (Front Wing, Brakes, Suspension, Rear
  Wing, Gearbox, Engine, Battery).
- Each card shows a **rarity badge**, a **Series badge** (e.g. *S3* — the
  Series that first unlocks the card), a **Level** with −/+ steppers, an
  **editable card count**, and a **progress bar toward the next level** (or
  **★ MAX** when the card is at its rarity cap). The bar label shows the
  **coin cost** to the next level alongside the card cost.
- **Stats & costs** panel per card (tap to expand): the card's per-level stats
  (drivers: Overtaking / Defending / Qualifying / Race Start / Tyre Use;
  components: Speed / Cornering / Power Unit / … as applicable), its
  **Total Value** and **Team Score**, and the **cards + coins remaining to
  reach max**.
- **“If upgraded” preview** in the same panel: the per-stat change from the
  current level to the next, the new Total / Team Score, and the exact
  **card + coin cost** to get there.
- **Boosted +10% toggle** per card: models the game's "boosted" card slot by
  scaling that card's displayed stats and Total / Team Score by +10%. (See
  *Data notes* for how Pit Time is handled.)
- **Series filter + sort** bar on the Drivers/Parts tabs: filter to a single
  unlock Series and sort by Series, Level, Total, Team Score or Name.
- **Collection "to max" summary** at the top of each tab: total cards left,
  total coins left, and how many cards are already maxed.
- **Search** by name and **filter chips** (All + each group of the active tab).
- **Export** / **Import** a JSON backup, and **Reset** to the built-in defaults.
- **Dark mode by default**, honoring `prefers-color-scheme`.

### Tools tab (coach)

Everything here is **computed live** from your current card levels — nothing is
stored.

- **Suggested Drivers** — for each attribute (Overtaking, Defending, Qualifying,
  Race Start, Tyre Mgmt) your best-owned drivers ranked by that stat at their
  current level, with rarity, level, Total / Team Score and the *→ next level*
  value. Cards you've flagged **Boosted +10%** are ranked with their boosted
  numbers.
- **Loadouts** — the best loadout from **your owned components** for each of
  nine strategies (Speed, Speed + Qualifying, Cornering, Cornering + Qualifying,
  Power Unit, Power Unit + Qualifying, Speed + Cornering,
  Speed + Cornering + Qualifying, Qualifying): one part per category chosen to
  maximise the strategy's stat(s), with the resulting aggregate stats, Total /
  Team Score, and an *if each part +1 level* projection.
- **Compare** — a sortable, side-by-side stat table of your drivers or your
  components at their current levels. Tap any column header to sort; the wide
  component table scrolls inside its own container.

### Season tab (progress dashboard)

A live snapshot of your season, seeded from the workbook's **CC Tracker**:

- **Season countdown** — a *days-left* counter plus editable **Season start**
  and **Season end** dates and a *season elapsed* bar (today is read live from
  the device clock).
- **Collection & race progress** — editable **current ÷ target** counts for
  Drivers, Driver Upgrades, Parts and Part Upgrades, plus milestone pickers for
  Weekly League, GP Medals (total & best), Highest Series, Races Done and Races
  Won. Each row shows a progress bar and a live percentage.
- **CC Score** — **Base Asset Progress**, **CC Rank** (/20), **CC Points**
  (/500) and **Total CC** (/650), all **recomputed live** exactly as the
  workbook does (average of the ten base metrics → rank → points → plus the
  coin-bank contribution). Editing any input updates the score instantly.
- **Now vs potential** — each CC figure also shows a **▲ potential** value
  underneath: what your score becomes if every count metric reaches its target
  (the workbook's *Potential Completion* projection). Editing a target updates
  the potential live.

Season inputs are saved separately in `localStorage` under **`f1sheet.season.v1`**
(schema-guarded, seeded from the v1.0 snapshot). Nothing leaves the device.

### Rewards tab (reference tables)

Read-only, searchable reference tables embedded from the community sheet:

- **Boosts** — all **65 named consumable boosts** and the flat per-race stat
  bonus each applies. Search by boost name *or* by a stat (e.g. type
  `cornering` to see every boost that helps cornering).
- **Series Unlocks** — how many drivers and parts first unlock at each Series.
- **Race Medal Payout** — medal-pot share by tier and finishing position.
- **Weekly League** — completion weight by final standing.
- **Races & Wins Milestones** — completion weight by total races/wins.
- **Series Progress** — completion weight by highest Series reached.
- **GP Medal Quality** — best-medal scoring scale.
- **Coins → CC** — coin-bank milestone to CC contribution.

The percentages are the same completion weights the Season tab uses for CC
scoring. Type in the search box to filter tables and rows.

### Reference data (stats & coin costs)

Per-level **stats**, **Total / Team Score**, **coin/card upgrade costs** and the
**unlock Series** are baked into the app from the *F1 Clash 2026 Resource Sheet
v1.1* reference tables. This now covers **all 88 driver cards** and **all 46
components** — every card the source sheet publishes. (An earlier build only
carried 13 drivers and 11 components; the full per-level dataset is embedded as
of this release.)

> **Cards-to-max**, **coins-to-max**, **stats**, **Series** and the
> **if-upgraded** preview are available for every card.

### Rules used for progress

```js
// cards needed to reach the NEXT level, keyed by current level
const COST = {1:4,2:10,3:20,4:50,5:100,6:200,7:400,8:1000,9:2000,10:4000,11:8000};
// max level per rarity
const CAP  = {Common:11, Rare:9, Epic:7, Legendary:5};
// per-card "boosted" slot scales stats by +10%
const BOOST_PCT = 0.10;
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

- Card levels/counts live in `localStorage` under the key **`f1sheet.v1`**.
- Only values you **change** are stored (as *overrides* keyed by card id), so
  future seed-data updates still flow through to cards you haven't touched.
- Season-dashboard values live under a separate key **`f1sheet.season.v1`**.
- Per-card **Boosted +10%** toggles live under **`f1sheet.boosted.v1`**.
- A `schema` field is stored on each for safe future migrations.
- Card id format: `d:<Rarity>:<Name>` for drivers, `c:<Category>:<Name>` for
  components.

> **Note:** Export / Import currently covers the card overrides (`f1sheet.v1`).
> Season inputs persist locally but aren't yet part of the backup file.

### Data notes / limitations

- The **Race Medal Payout**, **Weekly League**, **Races/Wins**, **Series**,
  **GP Medal** and **Coins → CC** tables are byte-identical in the v1.0 and
  v1.1 workbooks, so they're treated as stable game constants.
- **GP Medals Total** counts toward the CC score as complete once you hold at
  least one GP medal (mirroring the workbook's `IF(total>1, 1, total)` rule).
- **Per-Series unlocks are now included.** The v1.1 workbook carries a *Series*
  column on each card's stat rows (DriverStats col L, ComponentStats col O),
  read from each card's level-1 row. That drives the **Series badge**, the
  **Series filter/sort**, and the **Series Unlocks** reference table. The **22
  Legendary drivers carry Series 0** in the sheet (they unlock from sources
  other than Series progression), so they show **no Series badge**.
- **Boosts: 65 unique named boosts.** The workbook's *Boosts* sheet spans ~214
  rows, but that count includes blank separator rows and repeated header rows,
  and each boost is listed several times across rarity sections. De-duplicated,
  there are **65 distinct named boosts**, all with identical values across their
  repeats — those 65 are what's embedded.
- **"Boosted +10%" interpretation.** The workbook's *Data Input* sheet exposes a
  single global **Boost %** of `0.10` and a per-card **Boosted** boolean, i.e. a
  clean +10% "boosted slot" (distinct from the named consumable Boosts, which
  give flat bonuses). The toggle scales each of a card's positive stats and its
  Total / Team Score by +10% and rounds. **Pit Time is left unscaled** because
  it's a lower-is-better duration, not an additive stat — flagged here rather
  than guessed.
- **Loadouts are computed from your collection.** The workbook's *Suggested
  Loadouts* sheet is a large, formula-driven grid whose picks depend on the
  author's own owned components (mostly starter parts in the shared snapshot).
  Rather than embed those stale, author-specific values, the Tools → Loadouts
  view recomputes the best loadout **from your owned components** for each
  strategy — the same intent, kept live and useful as you level up.

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

Collection snapshot seeded from the community **F1 Clash 2026 Resource Sheet
v1.0**; per-level stats, costs, Series, boosts and reference tables from the
author's updated **v1.1** template — both by **TR The Flash**.
