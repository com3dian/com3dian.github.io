import Link from '@/components/Link'
import PostListRow from '@/components/PostListRow'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 20

export default function Home({ posts }) {
  return (
    <>
      <div className="pt-8 pb-10">
        <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
          {siteMetadata.description}
        </p>
      </div>
      <ul>
        {!posts.length && (
          <li className="py-6 text-gray-500 dark:text-gray-400">No posts found.</li>
        )}
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title } = post
          return <PostListRow key={slug} date={date} title={title} href={`/blog/${slug}`} />
        })}
      </ul>
      {posts.length > MAX_DISPLAY && (
        <div className="pt-6 text-sm">
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            aria-label="All posts"
          >
            All posts →
          </Link>
        </div>
      )}
    </>
  )
}
