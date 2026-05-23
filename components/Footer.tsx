import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
      <div className="flex flex-col items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex space-x-4">
          {siteMetadata.email && (
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          )}
          {siteMetadata.github && <SocialIcon kind="github" href={siteMetadata.github} size={5} />}
          {siteMetadata.linkedin && (
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2">
          <span>{siteMetadata.author}</span>
          <span>·</span>
          <span>© {new Date().getFullYear()}</span>
          <span>·</span>
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
