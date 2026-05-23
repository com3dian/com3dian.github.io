import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-2xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      {children}
    </h1>
  )
}
