import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass = 'flex w-full items-center justify-between py-6'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50 bg-white dark:bg-[#1d1e20]'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        {typeof siteMetadata.headerTitle === 'string' ? (
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {siteMetadata.headerTitle}
          </span>
        ) : (
          siteMetadata.headerTitle
        )}
      </Link>
      <div className="flex items-center gap-4 text-sm leading-5 sm:gap-5">
        <nav className="no-scrollbar hidden items-center gap-4 sm:flex">
          {headerNavLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
