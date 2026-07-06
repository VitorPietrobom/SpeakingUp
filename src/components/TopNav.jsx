import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoMark from '../assets/logo-mark.jpg'
import './TopNav.css'

const NAV_ITEMS = [
  { label: 'Aulas', to: '/aulas' },
  { label: 'Treinamento', to: '/treinamento' },
  { label: 'Organização', to: '/organizacao' },
]

export default function TopNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="su-header">
      <div className="su-header-bar su-wrap">
        <Link to="/" className="su-logo" onClick={close}>
          <span className="su-logo-word">
            Speaking<span className="su-logo-accent"> UP</span>
          </span>
          <span className="su-logo-tag">Comunicação que move</span>
        </Link>

        <nav className="su-navlinks">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `su-navlink${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="su-header-right">
          <img src={logoMark} alt="Speaking UP" className="su-logo-mark" />
          <button
            onClick={() => setOpen((o) => !o)}
            className="su-burger"
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`su-scrim${open ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <div className={`su-mpanel${open ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={close}
            className={({ isActive }) => `su-mlink${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  )
}
