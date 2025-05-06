const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Task } = require('../db');  // імпортуємо модель Task

// Мідлвар для парсингу JSON
app.use(bodyParser.json());

// Підключаємо маршрут для роботи з задачами
app.use('/api/tasks', require('../routes/tasks'));

// Підключення до MongoDB для тестів
beforeAll(async () => {
  // Підключення до бази даних MongoDB перед виконанням тестів
  await mongoose.connect('mongodb://127.0.0.1:27017/tasktracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Очищення бази даних перед кожним тестом
beforeEach(async () => {
  await Task.deleteMany();  // Очищаємо колекцію перед кожним тестом
});

// Закриття з'єднання після тестів
afterAll(async () => {
  await mongoose.connection.close();  // Закриваємо з'єднання після всіх тестів
});

describe('Task API', () => {
  
  // Тест на створення задачі
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });

    expect(res.statusCode).toBe(201);  // перевірка статусу 201 (успішне створення)
    expect(res.body.title).toBe('Test Task');  // перевірка правильності заголовка
  });

  // Тест на отримання всіх задач
  it('should fetch all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .send();

    expect(res.statusCode).toBe(200);  // перевірка статусу 200 (успішне отримання)
    expect(Array.isArray(res.body)).toBe(true);  // перевірка, що це масив
    expect(res.body.length).toBe(0);  // перевірка, що в масиві немає задач (зачищено перед тестами)
  });

  // Тест на видалення задачі
  it('should delete a task', async () => {
    // Спочатку створюємо задачу
    const taskRes = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task to Delete' });

    const taskId = taskRes.body._id;  // отримуємо ID створеної задачі

    // Тепер видаляємо задачу
    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .send();

    expect(deleteRes.statusCode).toBe(204);  // перевірка статусу 204 (успішне видалення)
    
    // Перевіримо, що задача дійсно видалена
    const resAfterDelete = await request(app).get('/api/tasks');
    expect(resAfterDelete.body.length).toBe(0);  // після видалення має бути 0 задач
  });

  // Тест на обробку помилки (неправильний запит, наприклад без заголовка)
  it('should return error when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});  // відправляємо пустий об'єкт

    expect(res.statusCode).toBe(500);  // перевірка статусу помилки
    expect(res.text).toBe('Task validation failed: title: Path `title` is required.');  // перевірка повідомлення про помилку
  });
});
