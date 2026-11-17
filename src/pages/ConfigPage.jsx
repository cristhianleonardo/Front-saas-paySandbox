import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_LABELS, PRODUCTS, SIMULATED_ERRORS } from '../lib/constants'
import { getConfig, saveConfig } from '../services/config'
import { getProductsFromApi } from '../services/products'
import { getUsersFromApi } from '../services/users'

const empty = {
  minAmount: '',
  maxAmount: '',
  startTime: '',
  endTime: '',
  startDate: '',
  endDate: '',
  blockedUserId: '',
  multiple: '',
  errors: [],
}

const FALLBACK_TABS = Object.values(PRODUCTS).map((key) => ({
  key,
  label: PRODUCT_LABELS[key],
}))

export default function ConfigPage() {
  const { company } = useAuth()
  const [params, setParams] = useSearchParams()
  const [tabs, setTabs] = useState(FALLBACK_TABS)
  const [users, setUsers] = useState([])
  const product = resolveProduct(params.get('producto'), tabs)
  const [form, setForm] = useState(() => getConfig(company.id, product) || empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    getProductsFromApi()
      .then((products) => {
        if (cancelled || !products.length) return
        setTabs(products.map((item) => ({
          key: item.key || String(item.id),
          label: item.name,
        })))
      })
      .catch(() => {
        if (!cancelled) setTabs(FALLBACK_TABS)
      })
    getUsersFromApi()
      .then((list) => { if (!cancelled) setUsers(list.filter((user) => user.active)) })
      .catch(() => { if (!cancelled) setUsers([]) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    setForm(getConfig(company.id, product) || empty)
    setError('')
    setSuccess(false)
  }, [company.id, product])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  function validate() {
    if (Number(form.minAmount) >= Number(form.maxAmount)) return 'El monto mínimo debe ser menor que el monto máximo'
    if (form.startTime >= form.endTime) return 'La hora de inicio debe ser anterior a la hora de fin'
    if (form.startDate > form.endDate) return 'La fecha de inicio no puede ser posterior a la fecha de fin'
    if (Number(form.multiple) <= 0) return 'El múltiplo debe ser mayor que cero'
    return ''
  }

  async function submit(event) {
    event.preventDefault()
    setSuccess(false)
    const validation = validate()
    if (validation) return setError(validation)
    try {
      // Escenarios de configuración siguen en mock: no hay endpoint de config en el backend.
      await saveConfig(company.id, product, form)
      setError('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3500)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  const productLabel = tabs.find((tab) => tab.key === product)?.label || PRODUCT_LABELS[product] || product

  return (
    <AppShell>
      <div className="config-page">
        <div className="page-heading">
          <div>
            <h1>Configuración</h1>
          </div>
        </div>
        <div className="tabs">
          {tabs.map((item) => (
            <button
              className={`tab ${product === item.key ? 'active' : ''}`}
              key={item.key}
              onClick={() => setParams({ producto: item.key })}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="panel panel-body" onSubmit={submit}>
          {success && <div className="success">Configuración actualizada correctamente</div>}
          {error && <div className="alert">{error}</div>}
          <section className="form-section">
            <h3>{productLabel}</h3>
            <div className="form-grid">
              <Field label="Monto mínimo" type="number" value={form.minAmount} onChange={(value) => update('minAmount', value)} />
              <Field label="Monto máximo" type="number" value={form.maxAmount} onChange={(value) => update('maxAmount', value)} />
            </div>
          </section>
          <section className="form-section">
            <h3>Horario diario</h3>
            <div className="form-grid">
              <Field label="Hora de inicio" type="time" value={form.startTime} onChange={(value) => update('startTime', value)} />
              <Field label="Hora de fin" type="time" value={form.endTime} onChange={(value) => update('endTime', value)} />
            </div>
          </section>
          <section className="form-section">
            <h3>Vigencia</h3>
            <div className="form-grid">
              <Field label="Fecha de inicio" type="date" value={form.startDate} onChange={(value) => update('startDate', value)} />
              <Field label="Fecha de fin" type="date" value={form.endDate} onChange={(value) => update('endDate', value)} />
            </div>
          </section>
          <section className="form-section">
            <h3>Controles</h3>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="blockedUserId">Usuario a bloquear</label>
                <select
                  id="blockedUserId"
                  value={form.blockedUserId}
                  onChange={(event) => update('blockedUserId', event.target.value)}
                >
                  <option value="">Ninguno</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Monto en múltiplos de X" type="number" value={form.multiple} onChange={(value) => update('multiple', value)} />
            </div>
          </section>
          <section className="form-section">
            <h3>Errores simulados</h3>
            <div className="checkbox-grid">
              {SIMULATED_ERRORS.map((item) => (
                <label className="check" key={item}>
                  <input
                    type="checkbox"
                    checked={form.errors.includes(item)}
                    onChange={(event) => update(
                      'errors',
                      event.target.checked
                        ? [...form.errors, item]
                        : form.errors.filter((errorItem) => errorItem !== item),
                    )}
                  />
                  {item}
                </label>
              ))}
            </div>
          </section>
          <div className="form-actions">
            <button className="button" type="submit">Guardar configuración</button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}

function resolveProduct(param, tabs) {
  if (tabs.some((tab) => tab.key === param)) return param
  return tabs[0]?.key || PRODUCTS.CASH_IN
}

function Field({ label, type, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  )
}
