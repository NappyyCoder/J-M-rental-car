import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li'
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      setVisible(true)
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties

  return (
    <Tag
      ref={ref as never}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </Tag>
  )
}
