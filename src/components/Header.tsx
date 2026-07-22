import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact'

type NavChild = {
  to: string
  label: string
}

type NavItem = {
  to: string
  label: string
  end?: boolean
  children?: NavChild[]
}

const links: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/about', label: 'About' },
  {
    to: '/services',
    label: 'Services',
    children: [{ to: '/faq', label: 'FAQ' }],
  },
  { to: '/contact', label: 'Contact' },
]

function isNavItemActive(item: NavItem, pathname: string, end?: boolean) {
  if (end) return pathname === item.to
  if (pathname === item.to) return true
  if (item.children?.some((child) => pathname === child.to)) return true
  return pathname.startsWith(`${item.to}/`)
}

export function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link
          to="/"
          className="brand"
          aria-label="J&amp;M Car Rental home"
          onClick={closeMenu}
        >
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
          {links.map((item) =>
            item.children ? (
              <div
                key={item.to}
                className={`nav-dropdown${isNavItemActive(item, pathname) ? ' is-active' : ''}`}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive || isNavItemActive(item, pathname) ? 'active nav-dropdown-trigger' : 'nav-dropdown-trigger'
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
                <div className="nav-dropdown-menu" role="menu" aria-label={`${item.label} submenu`}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      role="menuitem"
                      className={({ isActive }) => (isActive ? 'active' : undefined)}
                      onClick={closeMenu}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <a className="btn btn-primary btn-sm nav-cta" href={`tel:${PHONE_TEL}`}>
          {PHONE_DISPLAY}
        </a>
      </div>
    </header>
  )
}
