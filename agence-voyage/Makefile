include .env
export

.PHONY: setup db up down reset-db logs psql migrate seed dev-back dev-front

setup:           ## Première installation
	cp -n .env.example .env || true
	cd backend && npm install
	cd frontend && npm install

db:              ## Lance uniquement Postgres
	docker compose up -d db

up:              ## Lance tout dans Docker
	docker compose --profile app up --build

down:
	docker compose --profile app down

reset-db:        ## Supprime les données et relance la DB
	docker compose down -v && docker compose up -d db

logs:
	docker compose logs -f db

psql:
	docker compose exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

migrate:         ## Applique les migrations Prisma
	cd backend && npx prisma migrate dev

seed:
	cd backend && npm run db:seed

dev-back:
	cd backend && npm run dev

dev-front:
	cd frontend && npm run dev
