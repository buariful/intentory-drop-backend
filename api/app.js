const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'https://sneaker-drop-frontend-ppyko9wk4.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        // Allow requests from Postman / server-side scripts
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log('***REQUEST ORIGIN****', req.headers.origin);
  next();
});

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/drops', require('./routes/dropRoute'));
app.use('/api/auth', require('./routes/authRoute'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler (must be last)
app.use(globalErrorHandler);

module.exports = app;
