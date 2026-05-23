import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <header className="pb-8 pt-6">
          <time
            dateTime={date}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {formatDate(date, siteMetadata.locale)}
          </time>
          <div className="mt-3">
            <PageTitle>{title}</PageTitle>
          </div>
        </header>
        <div className="prose dark:prose-invert max-w-none py-8">{children}</div>
        <footer className="space-y-6 pt-8 text-sm">
          {(prev?.path || next?.path) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              {prev?.path && (
                <Link
                  href={`/${prev.path}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  aria-label={`Previous: ${prev.title}`}
                >
                  ← {prev.title}
                </Link>
              )}
              {next?.path && (
                <Link
                  href={`/${next.path}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 sm:text-right"
                  aria-label={`Next: ${next.title}`}
                >
                  {next.title} →
                </Link>
              )}
            </div>
          )}
          <Link
            href="/blog"
            className="inline-block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to posts
          </Link>
        </footer>
      </article>
    </SectionContainer>
  )
}
