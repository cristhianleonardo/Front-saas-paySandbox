import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_LABELS, PRODUCTS } from '../lib/constants'
import { getProductsFromApi } from '../services/products'

const FALLBACK_PRODUCTS = Object.values(PRODUCTS).map((key) => PRODUCT_LABELS[key]).join(' · ')

export default function DashboardPage() {
  const { company, user } = useAuth()
  return (
    <AppShell>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Espacio de trabajo</p>
          <h1>Hola, {user.name.split(' ')[0]}.</h1>
          <p className="subtitle">
            Configura los productos de pago disponibles para <strong>{company.name}</strong>.
          </p>
        </div>
      </div>
      <div className="product-grid">
        <ProductCard />
        {user.role === 'admin' && <UsersCard />}
      </div>
    </AppShell>
  )
}

function ProductCard() {
  const [summary, setSummary] = useState(FALLBACK_PRODUCTS)

  useEffect(() => {
    let cancelled = false
    getProductsFromApi()
      .then((products) => {
        if (cancelled) return
        if (!products.length) {
          setSummary('Sin productos habilitados')
          return
        }
        setSummary(products.map((item) => item.name).join(' · '))
      })
      .catch(() => {
        if (!cancelled) setSummary(FALLBACK_PRODUCTS)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <article className="product-card">
      <div>
        <div className="product-icon" aria-hidden="true">
          <svg className="settings-icon" viewBox="0 0 24 24" role="presentation">
            <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.7 7.7 0 0 0-1.69-.98L14.5 2.42A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42L9.13 5.07c-.6.24-1.17.57-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.41 1.09.74 1.69.98l.38 2.65A.49.49 0 0 0 10 22h4a.49.49 0 0 0 .49-.42l.38-2.65c.6-.24 1.17-.57 1.69-.98l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
          </svg>
        </div>
        <h2>Configuración de productos</h2>
        <p>{summary}</p>
      </div>
      <Link className="button card-action" to="/configuracion">
        Configurar <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

function UsersCard() {
  return (
    <article className="product-card users-card">
      <div>
        <div className="product-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <circle cx="9" cy="8" r="2.7" />
            <circle cx="16.5" cy="9" r="2.2" />
            <path d="M3.8 18c.5-2.8 2.4-4.4 5.2-4.4s4.7 1.6 5.2 4.4M14 14.7c2.8-.7 5.4.5 6.2 3.3" />
          </svg>
        </div>
        <h2>Gestión de usuarios</h2>
        <p>Administra el acceso de tu empresa</p>
      </div>
      <Link className="button card-action" to="/usuarios">
        Gestionar <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
