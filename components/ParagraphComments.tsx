'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import commentCounts from '../comment-counts.json'

const counts = commentCounts as Record<string, number>

type GiscusConfig = {
  repo?: string
  repositoryId?: string
  category?: string
  categoryId?: string
}

const giscusConfig: GiscusConfig =
  // @ts-expect-error giscusConfig is provided by siteMetadata at build time
  siteMetadata.comments?.giscusConfig ?? {}

const COMMENT_SVG = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.84 8.84 0 0 1-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7Z" clip-rule="evenodd" /></svg>`

function giscusTheme(resolvedTheme?: string) {
  return resolvedTheme === 'dark' ? 'transparent_dark' : 'light'
}

/** A single giscus thread mapped to one paragraph via a specific term. */
function GiscusThread({ term }: { term: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    const attrs: Record<string, string> = {
      'data-repo': giscusConfig.repo ?? '',
      'data-repo-id': giscusConfig.repositoryId ?? '',
      'data-category': giscusConfig.category ?? '',
      'data-category-id': giscusConfig.categoryId ?? '',
      'data-mapping': 'specific',
      'data-term': term,
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': giscusTheme(resolvedTheme),
      'data-lang': 'en',
      'data-loading': 'lazy',
    }
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v))
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
    // Re-create the thread whenever the paragraph (term) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  // Update theme on the fly without re-creating the iframe.
  useEffect(() => {
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme(resolvedTheme) } } },
      'https://giscus.app'
    )
  }, [resolvedTheme])

  return <div ref={containerRef} className="giscus" />
}

export default function ParagraphComments({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false)
  const [activeTerm, setActiveTerm] = useState<string | null>(null)
  const [activeLabel, setActiveLabel] = useState<string>('')

  const isConfigured = Boolean(giscusConfig.repo && giscusConfig.repositoryId)

  const openPanel = useCallback((term: string, label: string) => {
    setActiveTerm(term)
    setActiveLabel(label)
  }, [])

  const closePanel = useCallback(() => setActiveTerm(null), [])

  useEffect(() => setMounted(true), [])

  // Inject the comment icon at the end of each top-level paragraph.
  useEffect(() => {
    if (!isConfigured) return
    const container = document.getElementById('post-content')
    if (!container) return

    const paragraphs = Array.from(container.querySelectorAll<HTMLParagraphElement>(':scope > p'))
    const created: HTMLButtonElement[] = []

    paragraphs.forEach((p, index) => {
      if (p.querySelector('.pc-icon-btn')) return
      const term = `${slug}#p${index}`
      const count = counts[term] ?? 0

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'pc-icon-btn' + (count > 0 ? ' pc-has' : '')
      btn.setAttribute('aria-label', count > 0 ? `${count} comments` : 'Add a comment')
      btn.innerHTML = COMMENT_SVG + (count > 0 ? `<span class="pc-count">${count}</span>` : '')
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        openPanel(term, p.textContent?.trim().slice(0, 80) ?? '')
      })
      p.appendChild(document.createTextNode('\u00A0'))
      p.appendChild(btn)
      created.push(btn)
    })

    return () => {
      created.forEach((btn) => {
        btn.previousSibling?.remove()
        btn.remove()
      })
    }
  }, [slug, isConfigured, openPanel])

  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (activeTerm) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [activeTerm])

  // Close on Escape.
  useEffect(() => {
    if (!activeTerm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTerm, closePanel])

  if (!mounted || !isConfigured) return null

  return createPortal(
    <>
      <div
        className={`pc-backdrop ${activeTerm ? 'pc-open' : ''}`}
        onClick={closePanel}
        aria-hidden="true"
      />
      <aside
        className={`pc-panel ${activeTerm ? 'pc-open' : ''}`}
        role="dialog"
        aria-label="Paragraph comments"
      >
        <div className="pc-panel-header">
          <div>
            <p className="pc-panel-title">Comments</p>
            {activeLabel && <p className="pc-panel-sub">“{activeLabel}…”</p>}
          </div>
          <button type="button" className="pc-close" onClick={closePanel} aria-label="Close">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        <div className="pc-panel-body">
          {activeTerm && <GiscusThread key={activeTerm} term={activeTerm} />}
        </div>
      </aside>
    </>,
    document.body
  )
}
