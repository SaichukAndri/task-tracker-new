const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Task, mongoose } = require('../db');

const app = express();
app.use(bodyParser.json());
app.use('/api/tasks', require('../routes/tasks'));

beforeEach(async () => {
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  it('should fetch all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should delete a task', async () => {
    const taskRes = await request(app)
      .post('/api/tasks')
      .send({ title: 'Task to Delete' });
    const taskId = taskRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .send();
    expect(deleteRes.statusCode).toBe(204);

    const resAfterDelete = await request(app).get('/api/tasks');
    expect(resAfterDelete.body.length).toBe(0);
  });

  it('should return error when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});
    expect(res.statusCode).toBe(500);
  });
});