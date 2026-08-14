/* eslint-disable no-console -- dev-time build script, console output is intentional */
import { mkdir, readdir, rm, rename, access } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const IMAGES_DIR = new URL('../src/assets/images/', import.meta.url).pathname
const RAW_DIR = join(IMAGES_DIR, 'raw')

const HERO = 'hero'
const HERO_WIDTHS = [1600, 800]
const CARD_WIDTHS = [800, 400]
const JPEG_QUALITY = 80
const WEBP_QUALITY = 80

const cardFiles = [
  'event-morning-tea',
  'event-ndis-session',
  'event-sports-day',
  'news-transport',
  'news-volunteer',
  'news-ndis-review',
  'service-disability',
  'service-mental-health',
  'service-community',
  'service-health-wellbeing',
  'service-ndis-information',
  'service-eligibility-checker',
  'resource-ndis-plans',
  'resource-mental-health',
  'resource-carers',
  'resource-home-modifications',
  'resource-auslan',
  'resource-easy-read-rights',
  'resource-support-coordination',
  'resource-peer-support',
  'resource-accessible-transport',
  'resource-health-wellbeing',
  'resource-community-outreach',
  'resource-advocacy',
  'volunteer-hero',
  'volunteer-become',
  'volunteer-event-fun-run',
  'volunteer-event-training',
  'volunteer-event-gala',
  'volunteer-training-first-aid',
  'volunteer-training-online',
  'volunteer-training-inclusion',
]

/** Basenames that are genuine source originals — not generated width variants. */
const allowedRawNames = new Set([HERO, ...cardFiles])

function isSourceOriginal(filename) {
  if (!filename.endsWith('.jpg')) return false
  const baseName = filename.slice(0, -4)
  return allowedRawNames.has(baseName)
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function ensureRawSources() {
  await mkdir(RAW_DIR, { recursive: true })

  // Remove derivative outputs that were incorrectly archived into raw/.
  const rawEntries = await readdir(RAW_DIR)
  for (const entry of rawEntries) {
    if (!isSourceOriginal(entry)) {
      await rm(join(RAW_DIR, entry))
    }
  }

  const topLevel = await readdir(IMAGES_DIR)
  for (const entry of topLevel) {
    if (!isSourceOriginal(entry)) continue
    const from = join(IMAGES_DIR, entry)
    const to = join(RAW_DIR, entry)
    if (await exists(to)) {
      // Original already archived; remove the duplicate at top level.
      await rm(from)
      continue
    }
    await rename(from, to)
  }
}

async function writeVariant(sourcePath, destPath, width, format) {
  const image = sharp(sourcePath).resize({ width, withoutEnlargement: true })
  if (format === 'webp') {
    await image.webp({ quality: WEBP_QUALITY }).toFile(destPath)
  } else {
    await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(destPath)
  }
  console.log(`  wrote ${destPath}`)
}

async function generateHero() {
  const source = join(RAW_DIR, `${HERO}.jpg`)
  for (const width of HERO_WIDTHS) {
    await writeVariant(source, join(IMAGES_DIR, `hero-${width}.webp`), width, 'webp')
    await writeVariant(source, join(IMAGES_DIR, `hero-${width}.jpg`), width, 'jpeg')
  }
}

async function generateCards() {
  for (const name of cardFiles) {
    const source = join(RAW_DIR, `${name}.jpg`)
    for (const width of CARD_WIDTHS) {
      const suffix = width === 800 ? '' : `-${width}`
      await writeVariant(source, join(IMAGES_DIR, `${name}${suffix}.webp`), width, 'webp')
      await writeVariant(source, join(IMAGES_DIR, `${name}${suffix}.jpg`), width, 'jpeg')
    }
  }
}

async function main() {
  console.log('Optimizing images with sharp...')
  await ensureRawSources()
  console.log('Hero variants:')
  await generateHero()
  console.log('Card variants:')
  await generateCards()
  console.log('Done.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
