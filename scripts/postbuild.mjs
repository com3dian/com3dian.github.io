import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import rss from './rss.mjs'

async function postbuild() {
  const outDir = join(process.cwd(), 'out')
  const faviconIco = join(process.cwd(), 'public/favicon.ico')
  if (existsSync(outDir) && existsSync(faviconIco)) {
    copyFileSync(faviconIco, join(outDir, 'favicon.ico'))
  }
  await rss()
}

postbuild()
