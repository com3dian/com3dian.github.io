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
