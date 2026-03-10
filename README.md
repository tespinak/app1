# STOP MVP (Web)

MVP para apoyar a personas con problemas de apuestas con foco en prevención, seguimiento y acción en crisis.

## Stack
- React + TypeScript + Vite
- React Router DOM
- Supabase (Auth + Postgres + RLS)
- Context API

## Nuevas features incluidas
- Landing standalone SEO para test de diagnóstico CPGI adaptado (`/`).
- Home con nuevas fórmulas de recuperación (dinero/tiempo/contexto).
- Alerta predictiva por próximos partidos de equipos gatillo (`useUpcomingMatches` + `MatchAlertBanner`).
- Diario de impulsos con tabla `impulse_logs`, filtros y estadísticas.
- Upgrade a Premium con modal y hook de suscripción (`useSubscription`) + endpoints base de Stripe.

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

Completa `.env` con:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_FOOTBALL_KEY=...
```

Luego corre `supabase/schema.sql` en el SQL Editor de Supabase.

## Stripe test mode
- Crea `Product` y `Price` en Stripe dashboard.
- Define en backend/serverless:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`
  - `APP_URL`
- Usa `api/create-checkout-session.ts` y `api/stripe-webhook.ts` como base.
