export const companies = [
  { id: 'company-andina', name: 'Comercial Andina S.A.S.' },
  { id: 'company-pacifico', name: 'Logística del Pacífico S.A.S.' },
]

export const seedUsers = [
  { id: 'u-andina-admin', companyId: 'company-andina', name: 'Mariana Torres', email: 'admin@andina.test', password: 'admin123', role: 'admin', active: true },
  { id: 'u-andina-dev', companyId: 'company-andina', name: 'Diego Rojas', email: 'dev@andina.test', password: 'dev123', role: 'dev', active: true },
  { id: 'u-andina-qa', companyId: 'company-andina', name: 'Paula Gómez', email: 'qa@andina.test', password: 'qa123', role: 'qa', active: true },
  { id: 'u-andina-inactive', companyId: 'company-andina', name: 'Nicolás León', email: 'inactive@andina.test', password: 'test123', role: 'qa', active: false },
  { id: 'u-pacifico-admin', companyId: 'company-pacifico', name: 'Valentina Cruz', email: 'admin@pacifico.test', password: 'admin123', role: 'admin', active: true },
  { id: 'u-pacifico-dev', companyId: 'company-pacifico', name: 'Samuel Pérez', email: 'dev@pacifico.test', password: 'dev123', role: 'dev', active: true },
]

export const defaultConfigs = {
  'company-andina': {
    'cash-in': { active: true, minAmount: '10000', maxAmount: '5000000', startTime: '08:00', endTime: '17:00', startDate: '2026-01-01', endDate: '2026-12-31', blockedUserId: '', multiple: '1000', errors: [] },
    'cash-out': { active: true, minAmount: '20000', maxAmount: '2000000', startTime: '08:00', endTime: '16:00', startDate: '2026-01-01', endDate: '2026-12-31', blockedUserId: '', multiple: '1000', errors: [] },
  },
  'company-pacifico': {
    'cash-in': { active: true, minAmount: '50000', maxAmount: '8000000', startTime: '07:30', endTime: '18:00', startDate: '2026-02-01', endDate: '2026-12-31', blockedUserId: '', multiple: '5000', errors: [] },
    'cash-out': { active: false, minAmount: '50000', maxAmount: '1000000', startTime: '08:00', endTime: '15:00', startDate: '2026-02-01', endDate: '2026-12-31', blockedUserId: '', multiple: '5000', errors: [] },
  },
}
