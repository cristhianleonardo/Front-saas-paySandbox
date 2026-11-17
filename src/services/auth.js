import { API_BASE_URL } from '../lib/constants'
import { readStorage, writeStorage } from './storage'

const SESSION_KEY = 'paysandbox-session'

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: email, password }),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || 'Credenciales inválidas')

  const backendUser = payload.user
  const user = {
    id: backendUser.id,
    name: backendUser.nombre,
    email,
    companyId: String(backendUser.cliente_id),
    role: backendUser.rol,
    active: true,
  }
  const company = {
    id: String(backendUser.cliente_id),
    name: backendUser.cliente_nombre,
  }
  const session = {
    token: payload.access_token,
    tokenType: payload.token_type,
    expiresAt: Date.now() + payload.expires_in * 1000,
    user,
    company,
  }
  writeStorage(SESSION_KEY, session)
  return session
}

export function getSession() { return readStorage(SESSION_KEY, null) }
export function clearSession() { localStorage.removeItem(SESSION_KEY) }
