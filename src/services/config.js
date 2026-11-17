import { defaultConfigs } from './mockData'
import { readStorage, writeStorage } from './storage'

const CONFIG_KEY = 'paysandbox-configurations'
const MOCK_COMPANY_ID = 'company-andina'

// Escenarios de configuración (montos, horarios, errores, interruptor activo)
// siguen en mock/localStorage: el backend aún no expone API de configuraciones.
// GET /api/v1/products solo lista productos habilitados; no guarda reglas.

export function getConfig(companyId, product) {
  const saved = readStorage(CONFIG_KEY, defaultConfigs)
  const companyConfig = saved[companyId] || defaultConfigs[MOCK_COMPANY_ID]
  return companyConfig?.[product] || defaultConfigs[MOCK_COMPANY_ID]['cash-in']
}

export async function saveConfig(companyId, product, config) {
  // LIMITACIÓN CONOCIDA: este rechazo artificial permite probar el estado de error sin una API real.
  if (config.multiple === '13') throw new Error('No se pudo guardar la configuración')
  const saved = readStorage(CONFIG_KEY, defaultConfigs)
  const next = { ...saved, [companyId]: { ...(saved[companyId] || {}), [product]: config } }
  writeStorage(CONFIG_KEY, next)
  return config
}
