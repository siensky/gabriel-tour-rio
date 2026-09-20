import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { optimizeImages } from './optimize-images.mjs'

let rawDir, outDir, manifestPath, cleanup

beforeEach(async () => {
  const root = await mkdtemp(join(tmpdir(), 'optimize-images-test-'))
  rawDir = join(root, 'raw')
  outDir = join(root, 'out')
  manifestPath = join(outDir, 'manifest.json')
  cleanup = root
})

afterEach(async () => {
  await rm(cleanup, { recursive: true, force: true })
})

/** Writes a solid-colour synthetic JPEG or PNG straight into rawDir — no committed binary fixtures. */
async function writeFixture(fileName, { width, height, format = 'jpeg' }) {
  const { mkdir } = await import('node:fs/promises')
  await mkdir(rawDir, { recursive: true })
  const image = sharp({
    create: { width, height, channels: 3, background: { r: 14, g: 124, b: 123 } },
  })
  await (format === 'png' ? image.png() : image.jpeg()).toFile(join(rawDir, fileName))
}

describe('optimizeImages', () => {
  it('writes an empty manifest when assets/raw does not exist yet', async () => {
    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })
    expect(manifest).toEqual({})
    expect(JSON.parse(await readFile(manifestPath, 'utf8'))).toEqual({})
  })

  it('generates avif, webp and jpg at all three widths for a large source', async () => {
    await writeFixture('big-photo.jpg', { width: 2000, height: 40 })

    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })

    expect(Object.keys(manifest)).toEqual(['big-photo'])
    expect(manifest['big-photo'].width).toBe(2000)
    expect(manifest['big-photo'].height).toBe(40)
    for (const format of ['avif', 'webp', 'jpg']) {
      expect(manifest['big-photo'].formats[format].map((v) => v.width)).toEqual([480, 960, 1600])
    }

    const files = await readdir(outDir)
    expect(files).toContain('big-photo-1600.avif')
    expect(files).toContain('big-photo-480.webp')
    expect(files).toContain('big-photo-960.jpg')
  })

  it('never upscales — a source narrower than every target yields one variant at its own size', async () => {
    await writeFixture('tiny-photo.png', { width: 200, height: 200, format: 'png' })

    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })

    expect(manifest['tiny-photo'].formats.avif).toEqual([{ width: 200, path: 'img/tiny-photo-200.avif' }])
    const files = await readdir(outDir)
    expect(files.some((f) => f.includes('-480.'))).toBe(false)
    expect(files.some((f) => f.includes('-960.'))).toBe(false)
    expect(files.some((f) => f.includes('-1600.'))).toBe(false)
  })

  it('a source between two target widths gets every width up to its own', async () => {
    await writeFixture('mid-photo.jpg', { width: 1000, height: 40 })

    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })

    expect(manifest['mid-photo'].formats.jpg.map((v) => v.width)).toEqual([480, 960])
  })

  it('processes multiple images and records each under its own slug', async () => {
    await writeFixture('photo-one.jpg', { width: 2000, height: 40 })
    await writeFixture('photo-two.jpg', { width: 2000, height: 40 })

    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })

    expect(Object.keys(manifest).sort()).toEqual(['photo-one', 'photo-two'])
  })

  it('ignores non-image files sitting in assets/raw (e.g. README.md)', async () => {
    await writeFixture('photo.jpg', { width: 2000, height: 40 })
    const { writeFile } = await import('node:fs/promises')
    await writeFile(join(rawDir, 'README.md'), '# notes')

    const manifest = await optimizeImages({ rawDir, outDir, manifestPath })

    expect(Object.keys(manifest)).toEqual(['photo'])
  })
})
