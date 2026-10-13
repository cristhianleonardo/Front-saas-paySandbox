import { useState } from 'react'

export default function UserModal({ onCancel, onCreate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'dev' })
  const [error, setError] = useState('')
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  function submit(event) {
    event.preventDefault()
    if (!form.name || !form.email || !form.password) return setError('Completa todos los campos')
    try { onCreate(form) } catch (error) { setError(error.message) }
  }
  return <div className="modal-backdrop">
    <form className="modal" onSubmit={submit}>
      <h2>Nuevo usuario</h2>
      <div className="field"><label htmlFor="name">Nombre</label><input id="name" name="name" value={form.name} onChange={update} /></div>
      <div className="field"><label htmlFor="email">Correo</label><input id="email" name="email" type="email" value={form.email} onChange={update} /></div>
      <div className="field"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" value={form.password} onChange={update} /></div>
      <div className="field"><label htmlFor="role">Rol</label><select id="role" name="role" value={form.role} onChange={update}><option value="admin">admin</option><option value="dev">dev</option><option value="qa">qa</option></select></div>
      {error && <div className="alert">{error}</div>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancelar</button><button className="button" type="submit">Crear usuario</button></div>
    </form>
  </div>
}
