import { NavLink } from 'react-router-dom'
import './components.css'

// 3 tabs per SPEC (YOU cut from V1). SONGS goes pink when active, others gold.
const TABS = [
  { to: '/', glyph: '✦', label: 'SKY', cls: 'gold' },
  { to: '/practice', glyph: '◉', label: 'PRACTICE', cls: 'gold' },
  { to: '/songs', glyph: '♪', label: 'SONGS', cls: 'pink' },
]

export default function TabBar() {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) => `tabbar-item${isActive ? ` tabbar-item--${t.cls}` : ''}`}
        >
          <span className="tabbar-glyph">{t.glyph}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
