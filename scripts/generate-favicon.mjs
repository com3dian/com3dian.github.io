import { execFileSync } from 'child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const root = process.cwd()
const faviconsDir = join(root, 'public/static/favicons')
const logoPath = join(root, 'public/static/images/logo.png')

if (!existsSync(logoPath)) {
  throw new Error('Missing public/static/images/logo.png for favicon generation')
}

mkdirSync(faviconsDir, { recursive: true })

const favicon32 = join(root, 'public/favicon-32.png')
const appleTouch = join(faviconsDir, 'apple-touch-icon.png')
const favicon16 = join(faviconsDir, 'favicon-16x16.png')
const favicon32Static = join(faviconsDir, 'favicon-32x32.png')

await sharp(logoPath).resize(32, 32).png().toFile(favicon32)
await sharp(logoPath).resize(16, 16).png().toFile(favicon16)
copyFileSync(favicon32, favicon32Static)
await sharp(logoPath).resize(180, 180).png().toFile(appleTouch)

const npx = (args) =>
  execFileSync('npx', ['--yes', ...args], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })

const ico = npx(['png-to-ico', favicon32])
const faviconIco = join(root, 'public/favicon.ico')
const staticIco = join(faviconsDir, 'favicon.ico')

writeFileSync(faviconIco, ico)
copyFileSync(faviconIco, staticIco)

console.log('Generated favicons from public/static/images/logo.png')
