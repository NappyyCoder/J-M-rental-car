import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

type Props = {
  children: ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
