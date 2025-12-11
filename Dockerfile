# =====================
# 1. Build stage
# =====================
FROM node:20-slim AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем проект
COPY . .

# Сборка фронтенда
RUN npm run build

# =====================
# 2. Production runtime
# =====================
FROM node:20-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Копируем node_modules (production)
COPY --from=builder /app/node_modules ./node_modules

# Копируем собранный Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Запуск Next.js
CMD ["npm", "run", "start"]
