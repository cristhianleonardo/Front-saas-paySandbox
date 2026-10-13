import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { company, user } = useAuth()
  return <AppShell><div className="page-heading"><div><p className="eyebrow">Espacio de trabajo</p><h1>Hola, {user.name.split(' ')[0]}.</h1><p className="subtitle">Configura los productos de pago disponibles para <strong>{company.name}</strong>.</p></div>{user.role === 'admin' && <Link className="button secondary" to="/usuarios">Gestionar usuarios</Link>}</div><div className="product-grid"><ProductCard /></div></AppShell>
}

function ProductCard() { return <article className="product-card"><div><div className="product-icon">↓</div><h2>Configuración de productos</h2><p>Cash-in · Cash-out</p></div><Link className="button card-action" to="/configuracion">Configurar <span aria-hidden="true">→</span></Link></article> }
