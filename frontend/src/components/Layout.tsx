import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
