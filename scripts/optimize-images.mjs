#!/usr/bin/env node
/**
 * Reads assets/raw/, writes AVIF + WebP + JPEG at 480/960/1600px widths to
 * public/img/, and records a manifest of what was generated. <Picture>
 * (src/components/ui/Picture.tsx) reads that manifest to build a correct
 * `<picture>` element and to set width/height for zero layout shift.
 *
 * Never upscales — a source narrower than a target width is skipped for that
 * width, so a small source just yields fewer, smaller variants instead of a
 * blurry oversized one.
 *
 * Safe to run with an empty assets/raw/ (the state until Gabriel's photos
 * arrive): writes an empty manifest and exits 0, so `npm run build` never
 * fails for lack of content — matches every other content type on this site.
 *
 * CLI: `node scripts/optimize-images.mjs` (also runs automatically as the
 * first step of `npm run build`, see package.json).
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const WIDTHS = [480, 960, 1600]
const FORMATS = ['avif', 'webp', 'jpg']
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff'])

/**
 * Processes every image in `rawDir` into `outDir`, writes `manifestPath`.
 * Returns the manifest that was written — the pure part, easy to test
 * without touching the real assets/raw or public/img on disk.
 */
export async function optimizeImages({ rawDir, outDir, manifestPath }) {
  await mkdir(outDir, { recursive: true })

  let entries
  try {
    entries = await readdir(rawDir, { withFileTypes: true })
  } catch {
    entries = [] // assets/raw/ doesn't exist yet — treat as empty, not an error
  }

  const sourceFiles = entries
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)

  const manifest = {}

  for (const fileName of sourceFiles) {
    const slug = basename(fileName, extname(fileName))
    const inputPath = join(rawDir, fileName)
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    const sourceWidth = metadata.width ?? 0

    const formats = { avif: [], webp: [], jpg: [] }

    // Never upscale: skip any target wider than the source itself.
    const targetWidths = WIDTHS.filter((w) => w <= sourceWidth)
    // A source smaller than every target still gets one variant, at its own size.
    if (targetWidths.length === 0) targetWidths.push(sourceWidth)

    for (const width of targetWidths) {
      const resized = sharp(inputPath).resize({ width, withoutEnlargement: true })

      for (const format of FORMATS) {
        const outFileName = `${slug}-${width}.${format}`
        const outPath = join(outDir, outFileName)
        const pipeline =
          format === 'avif'
            ? resized.clone().avif({ quality: 60 })
            : format === 'webp'
              ? resized.clone().webp({ quality: 75 })
              : resized.clone().jpeg({ quality: 80, mozjpeg: true })

        await pipeline.toFile(outPath)
        formats[format].push({ width, path: `img/${outFileName}` })
      }
    }

    manifest[slug] = {
      width: sourceWidth,
      height: metadata.height ?? 0,
      formats,
    }
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  return manifest
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (isMain) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const rawDir = join(root, 'assets', 'raw')
  const outDir = join(root, 'public', 'img')
  const manifestPath = join(outDir, 'manifest.json')

  const manifest = await optimizeImages({ rawDir, outDir, manifestPath })
  const count = Object.keys(manifest).length

  console.log(
    count === 0
      ? `No images in assets/raw/ yet — wrote an empty manifest. <Picture> falls back to placeholders.`
      : `Optimised ${count} image${count === 1 ? '' : 's'} → public/img/`,
  )
}
