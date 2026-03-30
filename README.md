# Indonesian Cafe · Sheffield

A single-page marketing site for **Indonesian Cafe** in **Crookes, Sheffield** (15 Crookes, S10 1UA). The design follows the venue’s poster: deep red and burgundy, gold accents, cream sections, a subtle batik-style pattern, and the official poster art in the hero.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Bun** for installs and scripts

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the red patterned hero, gold headings, the framed poster image, a cream “menu highlights” band, and **Visit us** with the Sheffield address and Google Maps link.

## Project layout

| Path | Purpose |
|------|---------|
| `public/poster.png` | Poster image used in the hero and social preview metadata |
| `src/app/page.tsx` | Composes header, hero, menu, visit, footer |
| `src/app/layout.tsx` | Fonts (Geist, Montserrat, Playfair Display), SEO metadata |
| `src/app/globals.css` | `.batik-bg` pattern, focus rings, base body styles |
| `src/components/cafe/` | `SiteHeader`, `HeroSection`, `MenuSection`, `VisitSection`, `SiteFooter`, `ForkSpoonRule` |
| `src/lib/env.ts` | Zod-validated env (`NEXT_PUBLIC_APP_URL`, etc.) |

For a fuller map of the repo, see [`docs/CODEBASE_MAP.md`](docs/CODEBASE_MAP.md).

## Environment

Copy `.env.example` to `.env.local` if you need a production URL for metadata:

- `NEXT_PUBLIC_APP_URL` — canonical site URL for Open Graph / metadata base

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

Deploy like any Next.js app (e.g. Vercel).

## License

[MIT](LICENSE).
