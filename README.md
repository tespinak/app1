# STOP

Webapp anti-ludopatia hecha con Vite + React + lucide-react + inline styles.

## MVP

- Home con streak y metricas
- Boton rojo de crisis
- Countdown de 90 segundos con respiracion guiada

## Local

```powershell
npm install
npm run dev
```

## Deploy Railway

```powershell
.\deploy-railway.ps1
```

O manual:

```powershell
npm install -g @railway/cli
railway login
railway init --name stop-webapp
railway up
railway domain
```

Railway usa `railway.json` para build y start.

## GitHub publico

```powershell
git init
git add .
git commit -m "Launch STOP MVP"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/stop-clean.git
git push -u origin main
```

## Referencia util desde app1

- `api/create-checkout-session.ts`: base para Stripe Checkout suscripcion
- `src/screens/OnboardingScreen.tsx`: preguntas iniciales reutilizables
- `src/services/supabaseClient.ts`: modo demo + conexion Supabase
- `src/components/UpgradeModal.tsx`: paywall base
