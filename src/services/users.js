import { seedUsers } from './mockData'
import { readStorage, writeStorage } from './storage'

const USERS_KEY = 'paysandbox-users'
const getAll = () => readStorage(USERS_KEY, seedUsers)

export function getUsersByCompany(companyId) {
  // LIMITACIÓN CONOCIDA: el mock usa localStorage; el backend real debe aplicar este filtro y autorización en el servidor.
  return getAll().filter((user) => user.companyId === companyId)
}

export function createUser(companyId, data) {
  const current = getAll()
  if (current.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) throw new Error('El correo ya está registrado')
  const user = { ...data, id: `user-${Date.now()}`, companyId, active: true }
  writeStorage(USERS_KEY, [...current, user])
  return user
}

export function deactivateUser(companyId, userId) {
  const updated = getAll().map((user) => user.companyId === companyId && user.id === userId ? { ...user, active: false } : user)
  writeStorage(USERS_KEY, updated)
}
