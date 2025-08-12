FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (production)
RUN npm ci --omit=dev

# Копируем Prisma schema отдельно для генерации клиента
COPY prisma ./prisma

# Генерируем Prisma Client с бинарниками для Alpine
RUN npx prisma generate

# Копируем весь остальной исходный код
COPY . .

# Собираем проект (ts -> js)
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main"]
