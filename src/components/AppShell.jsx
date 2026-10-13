import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppShell({ children }) {
  const { user, company, logout } = useAuth()
  const location = useLocation()
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/dashboard"><span className="brand-mark">P</span> PaySandbox</Link>
      <div className="topbar-right"><span>{company?.name}</span><span className="avatar">{user?.name?.charAt(0)}</span><button className="button secondary" onClick={logout}>Cerrar sesión</button></div>
    </header>
    <main className="page">{children}</main>
    {location.pathname !== '/dashboard' && <Link className="back-link" style={{ position: 'fixed', left: '5vw', bottom: 24 }} to="/dashboard">← Volver al dashboard</Link>}
  </div>
}
