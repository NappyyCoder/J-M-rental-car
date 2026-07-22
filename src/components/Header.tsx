import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'

const links = [
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">J&amp;M</span>
          <span className="brand-sub">Car Rental LLC</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <a className="btn btn-primary btn-sm nav-cta" href={`tel:${PHONE_TEL}`}>
          {PHONE_DISPLAY}
        </a>
      </div>
    </header>
  )
}
