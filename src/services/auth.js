import { companies, seedUsers } from './mockData'
import { readStorage, writeStorage } from './storage'

const USERS_KEY = 'paysandbox-users'
const SESSION_KEY = 'paysandbox-session'

const users = () => readStorage(USERS_KEY, seedUsers)

export async function login(email, password) {
  const user = users().find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password && item.active)
  if (!user) throw new Error('Credenciales inválidas')
  const company = companies.find((item) => item.id === user.companyId)
  // LIMITACIÓN CONOCIDA: el token y la sesión viven en localStorage, y las contraseñas son datos de prueba; FastAPI deberá usar autenticación real.
  const session = { token: `mock-token-${user.id}`, user: { ...user, password: undefined }, company }
  writeStorage(SESSION_KEY, session)
  return session
}

export function getSession() { return readStorage(SESSION_KEY, null) }
export function clearSession() { localStorage.removeItem(SESSION_KEY) }
