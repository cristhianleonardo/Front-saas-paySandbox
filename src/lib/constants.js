export const PRODUCTS = { CASH_IN: 'cash-in', CASH_OUT: 'cash-out' }

export const PRODUCT_LABELS = {
  [PRODUCTS.CASH_IN]: 'Cash-in',
  [PRODUCTS.CASH_OUT]: 'Cash-out',
}

export const SIMULATED_ERRORS = [
  'Fondos insuficientes',
  'Banco rechaza operación',
  'Monto límite superado',
  'Timeout',
  'API caída',
  'Error de red',
  'Error 403',
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || ''
