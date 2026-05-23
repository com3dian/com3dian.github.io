import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  date: string
  title: string
  href: string
}

export default function PostListRow({ date, title, href }: Props) {
  return (
    <li className="py-2.5">
      <article className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        <time dateTime={date} className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          {formatDate(date, siteMetadata.locale)}
        </time>
        <Link
          href={href}
          className="text-gray-900 underline-offset-2 hover:underline dark:text-gray-100"
        >
          {title}
        </Link>
      </article>
    </li>
  )
}
