import GithubSlugger from 'github-slugger'
import type { Heading } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

export type TocItem = {
  value: string
  url: string
  depth: number
}

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---[\s\S]*?---\n?/, '')
}

/**
 * Extract TOC headings from raw MDX/Markdown.
 * Uses remark-math so display equations ($$ … $$) are not parsed as setext headings.
 */
export async function extractTocHeadings(markdown: string): Promise<TocItem[]> {
  const slugger = new GithubSlugger()
  const toc: TocItem[] = []
  const body = stripFrontmatter(markdown)

  await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(() => (tree: Parent) => {
      visit(tree, 'heading', (node: Heading) => {
        const textContent = toString(node).trim()
        if (!textContent || textContent.startsWith('$$')) {
          return
        }
        toc.push({
          value: textContent,
          url: '#' + slugger.slug(textContent),
          depth: node.depth,
        })
      })
    })
    .process(body)

  return toc
}

import { remark } from 'remark'
import remarkMath from 'remark-math'
import { remarkTocHeadings } from 'pliny/mdx-plugins/index.js'

export type TocHeading = {
  value: string
  url: string
  depth: number
}

/**
 * Extract TOC headings from MDX/Markdown while ignoring math blocks.
 * Plain remark treats "=" / "-" lines inside $$...$$ as setext headings.
 */
export async function extractTocHeadings(markdown: string): Promise<TocHeading[]> {
  const content = markdown.replace(/^---[\s\S]*?---\n*/, '')
  const vfile = await remark().use(remarkMath).use(remarkTocHeadings).process(content)
  const toc = (vfile.data.toc as TocHeading[] | undefined) ?? []

  return toc.filter((heading) => {
    const value = heading.value.trim()
    if (!value) return false
    if (value.startsWith('$$') || /\\[a-zA-Z]/.test(value)) return false
    return true
  })
}
