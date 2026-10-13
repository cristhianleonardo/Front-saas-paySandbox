import { createContext, useContext, useState } from 'react'
import { clearSession, getSession, login as authenticate } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession)

  async function login(email, password) {
    const next = await authenticate(email, password)
    setSession(next)
    return next
  }

  function logout() {
    clearSession()
    setSession(null)
  }

  return <AuthContext.Provider value={{ session, user: session?.user, company: session?.company, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
