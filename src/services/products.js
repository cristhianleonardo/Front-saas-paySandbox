import { API_BASE_URL, PRODUCTS } from '../lib/constants'
import { getSession } from './auth'

function productKey(nombre) {
  const normalized = String(nombre || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
  if (normalized === PRODUCTS.CASH_IN || normalized === 'cashin') return PRODUCTS.CASH_IN
  if (normalized === PRODUCTS.CASH_OUT || normalized === 'cashout') return PRODUCTS.CASH_OUT
  return normalized
}

function mapProduct(product) {
  return {
    id: product.id,
    name: product.nombre,
    description: product.descripcion || '',
    active: product.activo,
    key: productKey(product.nombre),
  }
}

export async function getProductsFromApi() {
  const session = getSession()
  const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${session.tokenType} ${session.token}`,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || 'No se pudieron cargar los productos')
  return payload.map(mapProduct)
}
