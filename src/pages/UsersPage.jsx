import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import Modal from '../components/Modal'
import UserModal from '../components/UserModal'
import { useAuth } from '../context/AuthContext'
import { createUserInApi, deactivateUserInApi, getUsersFromApi } from '../services/users'

export default function UsersPage() {
  const { user, company } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  useEffect(() => {
    getUsersFromApi().then(setUsers).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false))
  }, [])
  if (user.role !== 'admin') return <AppShell><div className="panel denied"><p className="eyebrow">Usuarios</p><h2>Acceso denegado</h2><p className="subtitle">Solo los administradores pueden gestionar usuarios.</p></div></AppShell>
  async function addUser(data) { const created = await createUserInApi(data); setUsers((current) => [...current, created]); setShowCreate(false); setMessage('Usuario creado correctamente'); setTimeout(() => setMessage(''), 3000) }
  async function confirmDeactivate() { const updated = await deactivateUserInApi(selected.id); setUsers((current) => current.map((item) => item.id === updated.id ? updated : item)); setSelected(null) }
  return <AppShell><div className="page-heading"><div><p className="eyebrow">Administración</p><h1>Usuarios</h1><p className="subtitle">Gestiona el acceso de las personas en {company.name}.</p></div><button className="button" onClick={() => setShowCreate(true)}>+ Nuevo usuario</button></div>{message && <div className="success">{message}</div>}{error && <div className="alert">{error}</div>}{loading ? <section className="panel panel-body">Cargando usuarios...</section> : <section className="panel"><div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th /></tr></thead><tbody>{users.map((item) => <tr key={item.id} className={!item.active ? 'inactive' : ''}><td className="user-name">{item.name}</td><td>{item.email}</td><td>{item.role}</td><td><span className={`status ${item.active ? 'active' : 'inactive'}`}>{item.active ? 'Activo' : 'Inactivo'}</span></td><td><button className="button danger" disabled={!item.active || item.id === user.id} onClick={() => setSelected(item)}>Inactivar</button></td></tr>)}</tbody></table></div></section>}{showCreate && <UserModal onCancel={() => setShowCreate(false)} onCreate={addUser} />}{selected && <Modal title="Inactivar usuario" onCancel={() => setSelected(null)} onConfirm={confirmDeactivate} confirmLabel="Inactivar" danger><p>¿Quieres inactivar a <strong>{selected.name}</strong>? Seguirá visible en la tabla, pero no podrá iniciar sesión.</p></Modal>}</AppShell>
}
