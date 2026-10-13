import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  if (session) return <Navigate to="/dashboard" replace />
  async function submit(event) {
    event.preventDefault()
    setError('')
    try { await login(email, password); navigate('/dashboard') } catch { setError('Credenciales inválidas') }
  }
  return <div className="login-page"><section className="login-panel"><div className="brand"><span className="brand-mark">P</span> PaySandbox</div><h1>Bienvenido.</h1><p className="subtitle">Accede al espacio operativo de tu empresa.</p><form className="login-form" onSubmit={submit}><div className="field"><label htmlFor="email">Correo</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="field"><label htmlFor="password">Contraseña</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>{error && <div className="alert">{error}</div>}<button className="button" type="submit">Iniciar sesión</button></form></section></div>
}
