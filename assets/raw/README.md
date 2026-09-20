# Raw images

Drop original photos here, named as the slug they'll be referenced by —
e.g. `christ-the-redeemer-hero.jpg` is referenced as `images.hero:
'christ-the-redeemer-hero'` in `content/tours.ts` (extension-less; the
pipeline generates AVIF/WebP/JPEG in three sizes from whatever format you
drop in).

Run `npm run optimize-images` (or just `npm run build`, which runs it first)
to process everything in this folder into `public/img/` and regenerate
`public/img/manifest.json`. `<Picture>` reads that manifest and falls back to
a placeholder for any slug that doesn't have a real image yet — so it's safe
to add photos incrementally, tour by tour.

This folder itself isn't optimised or served directly — only what
`scripts/optimize-images.mjs` produces in `public/img/` is.
