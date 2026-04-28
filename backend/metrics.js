const promClient = require('prom-client');

// Створення реєстру метрик
const register = new promClient.Registry();

// Додавання збирача метрик за замовчуванням до реєстру
promClient.collectDefaultMetrics({ register });

// Лічильник для відслідковування кількості HTTP запитів
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Загальна кількість HTTP запитів',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Гістограма для вимірювання тривалості HTTP запитів
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Тривалість HTTP запитів у секундах',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Лічильник для відслідковування операцій з завданнями
const taskOperationsTotal = new promClient.Counter({
  name: 'task_operations_total',
  help: 'Загальна кількість операцій з завданнями',
  labelNames: ['operation'],
  registers: [register],
});

// Проміжне ПЗ для збору метрик HTTP
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    
    // Інкремент лічильника запитів
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status: res.statusCode
    });
    
    // Вимірювання тривалості запиту
    const end = process.hrtime(start);
    const duration = end[0] + end[1] / 1e9; // в секундах
    
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: route,
        status: res.statusCode
      },
      duration
    );
  });
  
  next();
};

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationMicroseconds,
  taskOperationsTotal,
  metricsMiddleware
};