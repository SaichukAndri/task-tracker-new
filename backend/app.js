const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Task } = require('./db');
const tasksRouter = require('./routes/tasks');
const metrics = require('./metrics');

const app = express();

// Підключення до MongoDB, якщо з'єднання неактивне
if (mongoose.connection.readyState === 0) {
  mongoose.connect(
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasktracker',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(metrics.metricsMiddleware);

// Роут для метрик Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

// Основний API роут
app.use('/api/tasks', tasksRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  mongoose.connection.once('open', () => {
    console.log('🟢 MongoDB з\'єднання відкрите. Запускаємо сервер...');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер працює на порту ${PORT}`);
    });
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB помилка з\'єднання:', err.message);
  });
}

module.exports = app;
