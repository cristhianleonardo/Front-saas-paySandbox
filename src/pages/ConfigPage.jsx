import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { PRODUCTS, PRODUCT_LABELS, SIMULATED_ERRORS } from '../lib/constants'
import { getConfig, saveConfig } from '../services/config'
import { getUsersByCompany } from '../services/users'

const empty = { active: true, minAmount: '', maxAmount: '', startTime: '', endTime: '', startDate: '', endDate: '', blockedUserId: '', multiple: '', errors: [] }

export default function ConfigPage() {
  const { company } = useAuth()
  const [params, setParams] = useSearchParams()
  const product = params.get('producto') === PRODUCTS.CASH_OUT ? PRODUCTS.CASH_OUT : PRODUCTS.CASH_IN
  const [form, setForm] = useState(() => getConfig(company.id, product) || empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const users = getUsersByCompany(company.id)
  useEffect(() => { setForm(getConfig(company.id, product) || empty); setError(''); setSuccess(false) }, [company.id, product])
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  function validate() { if (Number(form.minAmount) >= Number(form.maxAmount)) return 'El monto mínimo debe ser menor que el monto máximo'; if (form.startTime >= form.endTime) return 'La hora de inicio debe ser anterior a la hora de fin'; if (form.startDate > form.endDate) return 'La fecha de inicio no puede ser posterior a la fecha de fin'; if (Number(form.multiple) <= 0) return 'El múltiplo debe ser mayor que cero'; return '' }
  async function submit(event) { event.preventDefault(); setSuccess(false); const validation = validate(); if (validation) return setError(validation); try { await saveConfig(company.id, product, form); setError(''); setSuccess(true); setTimeout(() => setSuccess(false), 3500) } catch (saveError) { setError(saveError.message) } }
  return <AppShell><div className="page-heading"><div><p className="eyebrow">Reglas de operación</p><h1>Configuración</h1><p className="subtitle">Define cómo funciona cada producto para tu empresa.</p></div></div><div className="tabs">{Object.values(PRODUCTS).map((item) => <button className={`tab ${product === item ? 'active' : ''}`} key={item} onClick={() => setParams({ producto: item })}>{PRODUCT_LABELS[item]}</button>)}</div><form className="panel panel-body" onSubmit={submit}>{success && <div className="success">Configuración actualizada correctamente</div>}{error && <div className="alert">{error}</div>}<section className="form-section"><div className="toggle-row"><div><h3>{PRODUCT_LABELS[product]}</h3><p>Permite operaciones de este producto para la empresa.</p></div><label className="switch"><input type="checkbox" checked={form.active} onChange={(event) => update('active', event.target.checked)} /><span className="slider" /></label></div><div className="form-grid"><Field label="Monto mínimo" type="number" value={form.minAmount} onChange={(value) => update('minAmount', value)} /><Field label="Monto máximo" type="number" value={form.maxAmount} onChange={(value) => update('maxAmount', value)} /></div></section><section className="form-section"><h3>Horario diario</h3><div className="form-grid"><Field label="Hora de inicio" type="time" value={form.startTime} onChange={(value) => update('startTime', value)} /><Field label="Hora de fin" type="time" value={form.endTime} onChange={(value) => update('endTime', value)} /></div></section><section className="form-section"><h3>Vigencia</h3><div className="form-grid"><Field label="Fecha de inicio" type="date" value={form.startDate} onChange={(value) => update('startDate', value)} /><Field label="Fecha de fin" type="date" value={form.endDate} onChange={(value) => update('endDate', value)} /></div></section><section className="form-section"><h3>Controles</h3><div className="form-grid"><div className="field"><label htmlFor="blockedUserId">Usuario a bloquear</label><select id="blockedUserId" value={form.blockedUserId} onChange={(event) => update('blockedUserId', event.target.value)}><option value="">Ninguno</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}</select></div><Field label="Monto en múltiplos de X" type="number" value={form.multiple} onChange={(value) => update('multiple', value)} /></div></section><section className="form-section"><h3>Errores simulados</h3><div className="checkbox-grid">{SIMULATED_ERRORS.map((item) => <label className="check" key={item}><input type="checkbox" checked={form.errors.includes(item)} onChange={(event) => update('errors', event.target.checked ? [...form.errors, item] : form.errors.filter((error) => error !== item))} />{item}</label>)}</div></section><div className="form-actions"><button className="button" type="submit">Guardar configuración</button></div></form></AppShell>
}

function Field({ label, type, value, onChange }) { return <div className="field"><label>{label}</label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required /></div> }
