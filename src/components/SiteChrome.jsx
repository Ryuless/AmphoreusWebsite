import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'

export function Header({ page }) {
  const links = [
    ['home', 'Home'],
    ['chronicle', 'Chronicle'],
    ['gallery', 'Gallery'],
    ['council', 'Council'],
    ['agenda', 'Agenda'],
  ]
  return (
    <header className="site-header">
      <a className="brand" href="/home">
        <BrandMark small />
        <span>amphoreus<br /><em>universe</em></span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(([href, label]) => (
          <a className={page === href ? 'is-active' : ''} href={`/${href}`} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <a className="header-note" href="/council">
          <span className="pulse" /> Est. June 2026
        </a>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><BrandMark small /><strong>Amphoreus Universe</strong></div>
      <p>A place for stories, signals, and staying awhile.</p>
    </footer>
  )
}
