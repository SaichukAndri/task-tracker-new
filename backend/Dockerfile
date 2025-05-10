FROM node:18-alpine

WORKDIR /app

# Копіювання лише package.json з батьківської директорії
COPY ../package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всього коду з папки backend
COPY ./backend/ .

EXPOSE 3000

CMD ["node", "app.js"]
