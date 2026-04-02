# Indonesian Cafe · Sheffield

Website for **[Indonesian Cafe](https://maps.app.goo.gl/p6cuBbE77hqYN3j68)** — an Indonesian restaurant and cafe in **Crookes, Sheffield, UK**.

| | |
|---|---|
| **Address** | 15 Crookes, Sheffield **S10 1UA**, South Yorkshire, United Kingdom |
| **Maps** | [Google Maps](https://maps.app.goo.gl/p6cuBbE77hqYN3j68) |
| **Cuisine** | Indonesian and Asian; home-style cooking, rice and noodle dishes, satay, cafe favourites |

**Opening hours** (bank holidays may differ — confirm on Google Maps before travelling):

| Day | Hours |
|-----|--------|
| Monday | 11 am–7 pm |
| Tuesday | Closed |
| Wednesday | 11 am–7 pm |
| Thursday | 11 am–7 pm |
| Friday | 11 am–7:30 pm |
| Saturday | 11 am–7 pm |
| Sunday | 11 am–7:30 pm |

The live site uses a deep red and burgundy palette with gold accents, cream sections, a subtle batik-style pattern, and poster art in the hero — aligned with the venue’s branding.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Convex** — menu and guest reviews (with static fallbacks when not configured)
- **Bun** for installs and scripts

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage flows: header → hero (slideshow) → about → menu highlights → word of mouth → visit (address, hours, map) → footer.

- **`/menu`** — full menu layout aimed at phones and QR scans; links to scanned paper menus as fallbacks.
- **`/reviews`** — guest reviews (Convex when configured, otherwise defaults).

Set `NEXT_PUBLIC_CONVEX_URL` in `.env.local` (see `.env.example`) to load live menu and review data from your Convex deployment. If it is unset, the site uses built-in defaults.

## Project layout

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home: header, hero, about, menu, word of mouth, visit |
| `src/app/menu/page.tsx` | Dedicated menu / QR destination |
| `src/app/reviews/page.tsx` | Guest reviews |
| `src/app/layout.tsx` | Fonts, metadata, JSON-LD |
| `src/app/globals.css` | Brand tokens, `.batik-bg`, base styles |
| `src/components/cafe/` | `SiteHeader`, `HeroSection`, `HeroSlideshow`, `AboutSection`, `MenuSection`, `WordOfMouthSection`, `VisitSection`, `SiteFooter`, reviews UI, etc. |
| `src/components/seo/` | `RestaurantJsonLd` (Schema.org) |
| `convex/` | Schema, menu/reviews queries, seed data |
| `src/lib/site.ts` | `SITE` constants, opening hours, JSON-LD builder |
| `src/lib/server/site-content.ts` | Server-side menu/review loader with Convex fallback |
| `src/lib/cafe-menu.ts` | Menu types and static fallback (`DEFAULT_SITE_MENU`) |
| `src/lib/guest-reviews.ts` | Review types and defaults |
| `src/lib/env.ts` | Zod-validated env for server usage |
| `public/poster.png`, `public/logo.png` | Hero / branding / metadata images |

For a fuller map of the repo, see [`docs/CODEBASE_MAP.md`](docs/CODEBASE_MAP.md).

## Environment

Copy `.env.example` to `.env.local` and adjust as needed:

- **`NEXT_PUBLIC_APP_URL`** — canonical site URL for Open Graph, sitemap, robots, and JSON-LD. In production use your real domain, e.g. **`https://indonesiancafe.co.uk`** (not the `*.vercel.app` host), so metadata and Search Console stay consistent.
- **Vercel always keeps** a `*.vercel.app` URL for your project; that does not go away when you add a custom domain. The custom domain is an extra hostname for the same deployment. In Vercel → Domains, set **`indonesiancafe.co.uk` as the primary** production domain so visitors and (typically) the production `vercel.app` URL are steered toward the domain you want public.
- Optional locally; without it, dev uses localhost and Vercel builds can fall back to `VERCEL_URL`.
- Required for non-local builds when you are not relying on `VERCEL_URL`, so metadata does not ship with localhost URLs.
- **`NEXT_PUBLIC_CONVEX_URL`** — Convex deployment URL for live menu and reviews

Other variables in `.env.example` are for production deploy, Convex HTTP/admin, or tooling — see comments in that file.

## Tests

```bash
bun run test        # watch
bun run test:run    # single run
```

## Build

```bash
bun run build
bun run start
```

Deploy like any Next.js app (e.g. Vercel). After a fresh Convex deployment, you can load default menu and review data with `bun run convex:seed` (or `bun run convex:seed:prod` for production); see `package.json`.

## Follow-up

The breakfast subtitle currently claims `From 8 till 11`, but the published site-wide opening hours start at 11 am. That copy is intentionally unchanged in code until the owners confirm the real breakfast window.

## License

[MIT](LICENSE).
