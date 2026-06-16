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

const tocListClassName = [
  'list-none space-y-0.5 pl-0',
  '[&_a]:text-gray-700 [&_a]:no-underline [&_a]:hover:text-primary-600',
  'dark:[&_a]:text-gray-300 dark:[&_a]:hover:text-primary-400',
  '[&_ul]:mt-0.5 [&_ul]:list-none [&_ul]:space-y-0.5 [&_ul]:pl-4',
  // Level 1: filled dot (on link so nested ul stays below)
  '[&>li>a]:inline-flex [&>li>a]:items-center [&>li>a]:gap-2',
  "[&>li>a]:before:size-1.5 [&>li>a]:before:shrink-0 [&>li>a]:before:rounded-full [&>li>a]:before:bg-primary-500 [&>li>a]:before:content-['']",
  // Level 2+: hollow dot
  '[&_ul>li>a]:inline-flex [&_ul>li>a]:items-center [&_ul>li>a]:gap-2',
  "[&_ul>li>a]:before:size-1.5 [&_ul>li>a]:before:shrink-0 [&_ul>li>a]:before:rounded-full [&_ul>li>a]:before:border [&_ul>li>a]:before:border-primary-500 [&_ul>li>a]:before:bg-transparent [&_ul>li>a]:before:content-['']",
  'dark:[&_ul>li>a]:before:border-primary-400',
].join(' ')

export default function CollapsibleTOC({ toc, defaultOpen = true }: CollapsibleTOCProps) {
  const hasHeadings = toc?.some((heading) => heading.depth >= 1 && heading.depth <= 6)
  if (!hasHeadings) {
    return null
  }

  return (
    <details
      className="group mb-3 rounded-md bg-gray-50/80 px-4 py-3 dark:bg-gray-800/40"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none text-base font-medium text-gray-800 select-none marker:content-none dark:text-gray-200 [&::-webkit-details-marker]:hidden">
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
      <nav
        className="mt-3 pt-3 text-base leading-normal font-sans"
        aria-label="Table of contents"
      >
        <TOCInline toc={toc} fromHeading={1} toHeading={6} ulClassName={tocListClassName} />
      </nav>
    </details>
  )
}
