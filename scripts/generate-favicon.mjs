import { execFileSync } from 'child_process'
import { copyFileSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const faviconsDir = join(root, 'public/static/favicons')
const emojiCodepoint = '1fab7' // 🪷 lotus
const twemojiUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${emojiCodepoint}.png`

mkdirSync(faviconsDir, { recursive: true })

const png = Buffer.from(await fetch(twemojiUrl).then((r) => {
  if (!r.ok) throw new Error(`Failed to fetch Twemoji PNG: ${r.status}`)
  return r.arrayBuffer()
}))

const favicon32 = join(root, 'public/favicon-32.png')
const appleTouch = join(faviconsDir, 'apple-touch-icon.png')

writeFileSync(favicon32, png)
writeFileSync(appleTouch, png)

const npx = (args) =>
  execFileSync('npx', ['--yes', ...args], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })

const ico = npx(['png-to-ico', favicon32])
const faviconIco = join(root, 'public/favicon.ico')
const staticIco = join(faviconsDir, 'favicon.ico')

writeFileSync(faviconIco, ico)
copyFileSync(faviconIco, staticIco)
copyFileSync(favicon32, join(faviconsDir, 'favicon-32x32.png'))
copyFileSync(favicon32, join(faviconsDir, 'favicon-16x16.png'))

console.log('Generated emoji favicons from Twemoji')
