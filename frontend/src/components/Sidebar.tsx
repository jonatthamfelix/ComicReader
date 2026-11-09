import { NavLink } from 'react-router'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">CR</span>
        <span>ComicReader</span>
      </NavLink>

      <nav>
        <NavLink to="/" end>
          Biblioteca
        </NavLink>
        <NavLink to="/import">Importar</NavLink>
      </nav>
    </aside>
  )
}
