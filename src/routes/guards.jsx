import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute() {
  const { session } = useAuth()
  const location = useLocation()
  return session ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function AdminRoute() {
  const { user } = useAuth()
  // TODO: cuando exista FastAPI, el backend debe validar el rol en cada operación; este guard solo protege la experiencia del mock.
  return user?.role === 'admin' ? <Outlet /> : <div className="app-shell"><main className="page"><div className="panel denied"><p className="eyebrow">Usuarios</p><h2>Acceso denegado</h2><p className="subtitle">Solo los administradores pueden gestionar usuarios.</p></div></main></div>
}
