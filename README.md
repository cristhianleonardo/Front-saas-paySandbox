# PaySandbox frontend

Frontend React + Vite del sandbox B2B multi-tenant. Actualmente usa servicios mock persistidos en `localStorage`, aislados por empresa, para poder sustituirlos después por el backend FastAPI.

## Ejecutar

```bash
npm install
npm run dev
```

Cuando exista el backend real, configura `VITE_API_URL` en `.env` con su URL base. Las credenciales incluidas son únicamente de prueba.
