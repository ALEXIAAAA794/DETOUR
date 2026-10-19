# Agence de voyage

Application de gestion d'agence de voyage : **React (Vite)** + **Node/Express** + **PostgreSQL (Docker)** + **Prisma**.

## Prérequis
- Node.js 22+
- Docker & Docker Compose
- Git

## Démarrage rapide (5 minutes)

```bash
cp .env.example .env            # puis adapte les valeurs
docker compose up -d db         # lance Postgres
cd backend && npm install
npx prisma migrate dev --name init
npm run db:seed                 # données de test
npm run dev                     # API sur http://localhost:3000
```

Dans un second terminal :

```bash
cd frontend && npm install && npm run dev   # http://localhost:5173
```

Ou avec le Makefile : `make setup`, `make db`, `make migrate`, `make seed`, `make dev-back`, `make dev-front`.

Tout dans Docker : `docker compose --profile app up --build`
(les migrations se lancent alors avec `docker compose exec backend npx prisma migrate deploy`).

## Vérifier que ça marche
- `GET http://localhost:3000/health` → `{ "status": "ok", "db": "up" }`
- `GET http://localhost:3000/api/destinations`

## Structure
```
backend/    API Express + TypeScript + Prisma
  src/config        env, client Prisma
  src/routes        déclaration des routes
  src/controllers   gestion HTTP + validation Zod
  src/services      logique métier / accès DB
  src/middlewares   erreurs, 404
  prisma/           schéma, migrations, seed
frontend/   React + Vite + TypeScript
```

## Conventions
- Branches : `main` (stable), `feature/...`, `fix/...`. PR obligatoire vers `main`.
- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Ne jamais commiter `.env`. Les migrations Prisma, elles, sont à commiter.
- Montants en `Decimal`, dates en UTC.

## Prochaines étapes
Auth (JWT + cookies httpOnly), CRUD voyages/clients, réservations (transactions), paiement Stripe, tests.
