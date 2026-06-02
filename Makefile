# ╔══════════════════════════════════════════════════════════╗
# ║              JobFy – Makefile                           ║
# ║  Shortcuts cho các lệnh phát triển và deployment        ║
# ╚══════════════════════════════════════════════════════════╝

.PHONY: help dev dev-backend dev-frontend \
        build build-backend build-frontend \
        docker-up docker-down docker-prod docker-prod-down \
        db-migrate db-studio \
        lint type-check audit clean

# Màu sắc terminal
CYAN  := \033[36m
RESET := \033[0m
BOLD  := \033[1m

## ─────────────────────────────────────────────
## help: Hiển thị danh sách lệnh
## ─────────────────────────────────────────────
help:
	@echo ""
	@echo "$(BOLD)JobFy – Available Commands$(RESET)"
	@echo "─────────────────────────────────────────"
	@grep -E '^## ' Makefile | sed 's/## /  $(CYAN)make$(RESET) /'
	@echo ""

## ─────────────────────────────────────────────
## dev: Chạy cả backend và frontend (Docker)
## ─────────────────────────────────────────────
dev: docker-up

## dev-backend: Chạy backend local (không dùng Docker)
dev-backend:
	cd backend && npm run dev

## dev-frontend: Chạy frontend local
dev-frontend:
	cd frontend && npm run dev

## ─────────────────────────────────────────────
## build-backend: Build backend TypeScript
## ─────────────────────────────────────────────
build-backend:
	cd backend && npm run build

## build-frontend: Build frontend Vite
build-frontend:
	cd frontend && npm run build

## build: Build cả hai
build: build-backend build-frontend

## ─────────────────────────────────────────────
## docker-up: Khởi động môi trường dev (Docker Compose)
## ─────────────────────────────────────────────
docker-up:
	docker compose up -d
	@echo "$(CYAN)✅ Dev environment started$(RESET)"
	@echo "   Backend:  http://localhost:5000"
	@echo "   Frontend: http://localhost:5173"

## docker-down: Tắt môi trường dev
docker-down:
	docker compose down

## docker-prod: Khởi động môi trường production
docker-prod:
	docker compose -f docker-compose.production.yml up -d --build
	@echo "$(CYAN)✅ Production environment started$(RESET)"

## docker-prod-down: Tắt production environment
docker-prod-down:
	docker compose -f docker-compose.production.yml down

## ─────────────────────────────────────────────
## db-migrate: Chạy Prisma migrations
## ─────────────────────────────────────────────
db-migrate:
	cd backend && npx prisma migrate dev

## db-studio: Mở Prisma Studio (DB GUI)
db-studio:
	cd backend && npx prisma studio

## db-generate: Tái tạo Prisma client sau khi thay đổi schema
db-generate:
	cd backend && npx prisma generate

## ─────────────────────────────────────────────
## lint: Chạy ESLint cho frontend
## ─────────────────────────────────────────────
lint:
	cd frontend && npm run lint

## type-check: Kiểm tra TypeScript cả hai project
type-check:
	@echo "$(CYAN)🔍 Type-checking backend...$(RESET)"
	cd backend && npx tsc --noEmit
	@echo "$(CYAN)🔍 Type-checking frontend...$(RESET)"
	cd frontend && npm run type-check
	@echo "$(CYAN)✅ All type checks passed$(RESET)"

## audit: Chạy npm security audit
audit:
	@echo "$(CYAN)🔒 Auditing backend...$(RESET)"
	cd backend && npm audit --audit-level=high --omit=dev
	@echo "$(CYAN)🔒 Auditing frontend...$(RESET)"
	cd frontend && npm audit --audit-level=high --omit=dev

## ─────────────────────────────────────────────
## clean: Xóa build artifacts
## ─────────────────────────────────────────────
clean:
	rm -rf backend/dist
	rm -rf frontend/dist
	@echo "$(CYAN)🧹 Cleaned build artifacts$(RESET)"

## install: Cài đặt deps cho cả hai project
install:
	cd backend && npm install
	cd frontend && npm install
