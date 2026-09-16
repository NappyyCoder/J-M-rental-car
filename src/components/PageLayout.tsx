import { useEffect, type ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

type Props = {
  children: ReactNode
  noIndex?: boolean
}

export function PageLayout({ children, noIndex = false }: Props) {
  useEffect(() => {
    if (!noIndex) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [noIndex])

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
