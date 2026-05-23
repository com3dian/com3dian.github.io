import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <div className="pt-8 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">About</h1>
      </div>
      <div className="items-start space-y-8 border-t border-gray-200 pt-8 dark:border-gray-700 xl:grid xl:grid-cols-3 xl:gap-x-10 xl:space-y-0">
        <div className="flex flex-col items-center xl:items-start">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={160}
              height={160}
              className="h-40 w-40 rounded-full"
            />
          )}
          <h2 className="pt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
          {occupation && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{occupation}</p>
          )}
          {company && <p className="text-sm text-gray-500 dark:text-gray-400">{company}</p>}
          <div className="flex space-x-3 pt-4">
            {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
            {github && <SocialIcon kind="github" href={github} />}
            {linkedin && <SocialIcon kind="linkedin" href={linkedin} />}
            {twitter && <SocialIcon kind="x" href={twitter} />}
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none xl:col-span-2">{children}</div>
      </div>
    </>
  )
}
