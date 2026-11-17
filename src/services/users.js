import { API_BASE_URL } from '../lib/constants'
import { getSession } from './auth'
import { seedUsers } from './mockData'
import { readStorage } from './storage'

async function request(path, options = {}) {
  const session = getSession()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${session.tokenType} ${session.token}`,
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || 'No se pudo completar la operación')
  return payload
}

// Fallback mock (p. ej. pruebas locales sin API). La pantalla de config usa getUsersFromApi.
export function getUsersByCompany(companyId) {
  return readStorage('paysandbox-users', seedUsers).filter((user) => user.companyId === companyId)
}

function mapUser(user) {
  return {
    id: user.id,
    name: user.nombre,
    email: user.email,
    role: user.rol,
    active: user.activo,
    companyId: String(user.cliente_id),
  }
}

export async function getUsersFromApi() {
  const users = await request('/api/v1/users')
  return users.map(mapUser)
}

export async function createUserInApi(data) {
  const user = await request('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify({
      nombre: data.name,
      email: data.email,
      password: data.password,
      rol: data.role,
    }),
  })
  return mapUser(user)
}

export async function deactivateUserInApi(userId) {
  const user = await request(`/api/v1/users/${userId}/deactivate`, { method: 'PATCH' })
  return mapUser(user)
}
