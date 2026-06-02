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
