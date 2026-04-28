FROM node:18-alpine

WORKDIR /app

# Копіювання package.json з кореня проєкту (build context = корінь)
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання коду backend
COPY backend/ .

EXPOSE 3000

CMD ["node", "app.js"]
