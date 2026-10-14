# ID card — live

A personalized profile card for Balakrishnan M: an image-only front and a focused
facts-only back, delivered as vector files plus a self-contained interactive page.

The portfolio uses the front and back SVGs as an accessible 3D-flipping profile card.
The portrait is loaded from the local portfolio asset. The back contains only the
four requested details: location, availability, work preference, and email.

## Files

| File | What it is |
| --- | --- |
| `id-card-live.html` | **The live card.** Open it — edit fields, replace the photo, flip it, and download the result. Fully offline, nothing leaves the browser. |
| `id-card-front.svg` / `id-card-back.svg` | Personalized 1024 × 1440 SVG faces with embedded fonts |
| `id-card-front.png` / `id-card-back.png` | Original raster previews; the portfolio uses the personalized SVG faces for sharp text and the portrait |
| `id-card-front-and-back.png` | Both faces side by side |
| `id-card-live-preview.png` / `-back.png` | Screenshots of the live page |
| `src/` | Build scripts (below) |

## What the live card does

- **Edit in place** — the four back-card fields drive the SVG text live.
- **Photo** — replace the portrait locally with a JPG/PNG; it is read with `FileReader`
  and never uploaded.
- **Physics** — grab the card and drag; it swings on the lanyard, throws and damps out.
  Double-click (or the button) flips it. Respects `prefers-reduced-motion`.
- **Export** — "Download front/back SVG" writes out the card *with your text*, standalone
  and still vector.

## Design system

The redesigned system uses a 1024 × 1440 artboard, deep navy `#0F1E33`, warm paper
`#F4F1EA`, electric blue `#1F44E0`, and IBM Plex Mono for metadata. The front is
only the portrait; the back uses a structured facts grid with no QR panel or extra copy.

## Rebuild

```bash
npm install                 # playwright for the optional render/test scripts
npm run build               # -> id-card-front.svg, id-card-back.svg, id-card-live.html
npm run render              # -> PNGs at 2x + live page screenshots
npm test                    # drives the live page: edit, flip, drag, export, reset
```
