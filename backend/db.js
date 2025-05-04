const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasktracker';

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Підключення до MongoDB успішне'))
  .catch(err => console.error('❌ Помилка підключення до MongoDB:', err.message));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task, mongoose };