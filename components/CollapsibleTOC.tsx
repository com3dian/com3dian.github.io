import TOCInline from 'pliny/ui/TOCInline'

export type TocHeading = {
  value: string
  url: string
  depth: number
}

interface CollapsibleTOCProps {
  toc: TocHeading[]
  /** When true, the outline starts expanded (default). */
  defaultOpen?: boolean
}

export default function CollapsibleTOC({ toc, defaultOpen = true }: CollapsibleTOCProps) {
  const hasHeadings = toc?.some((heading) => heading.depth >= 2 && heading.depth <= 6)
  if (!hasHeadings) {
    return null
  }

  return (
    <details
      className="group mb-8 rounded-md bg-gray-50/80 px-4 py-3 dark:bg-gray-900/40"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none text-sm font-medium text-gray-800 select-none marker:content-none dark:text-gray-200 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <span
            className="inline-block text-gray-400 transition-transform group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          Table of contents
        </span>
      </summary>
      <nav className="mt-3 pt-3" aria-label="Table of contents">
        <TOCInline
          toc={toc}
          fromHeading={2}
          toHeading={6}
          ulClassName="list-none space-y-1.5 pl-0 [&_a]:text-gray-700 [&_a]:no-underline [&_a]:hover:text-primary-600 dark:[&_a]:text-gray-300 dark:[&_a]:hover:text-primary-400 [&_ul]:mt-1.5 [&_ul]:list-none [&_ul]:space-y-1.5 [&_ul]:pl-4"
        />
      </nav>
    </details>
  )
}
