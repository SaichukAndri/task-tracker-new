const express = require('express');
const cors = require('cors');
const { Task } = require('./db');  // Потрібно імпортувати тільки Task, не mongoose
const tasksRouter = require('./routes/tasks');

const app = express();

// Підключення mongoose
const mongoose = require('mongoose');

// Перевірка активного з'єднання
if (mongoose.connection.readyState === 0) {
  mongoose.connect('mongodb://127.0.0.1:27017/tasktracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.use(cors());
app.use(express.json());
app.use('/api/tasks', tasksRouter);

const PORT = 3000;

if (require.main === module) {
  mongoose.connection.once('open', () => {
    console.log('🟢 MongoDB з’єднання відкрите. Запускаємо сервер...');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер працює на порту ${PORT}`);
    });
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB помилка з’єднання:', err.message);
  });
}

module.exports = app;
