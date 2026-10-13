import { defaultConfigs } from './mockData'
import { readStorage, writeStorage } from './storage'

const CONFIG_KEY = 'paysandbox-configurations'

export function getConfig(companyId, product) {
  const saved = readStorage(CONFIG_KEY, defaultConfigs)
  return saved[companyId]?.[product] || defaultConfigs[companyId]['cash-in']
}

export async function saveConfig(companyId, product, config) {
  // LIMITACIÓN CONOCIDA: este rechazo artificial permite probar el estado de error sin una API real.
  if (config.multiple === '13') throw new Error('No se pudo guardar la configuración')
  const saved = readStorage(CONFIG_KEY, defaultConfigs)
  const next = { ...saved, [companyId]: { ...saved[companyId], [product]: config } }
  writeStorage(CONFIG_KEY, next)
  return config
}
