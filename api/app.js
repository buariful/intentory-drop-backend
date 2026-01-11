const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();
const allowedOrigins = [
  'https://sneaker-drop-frontend-gscv0uag8.vercel.app',
  'http://localhost:5173',
];

app.use(cors({ origin: 'https://sneaker-drop-frontend-gscv0uag8.vercel.app' }));
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow Postman / server-side calls
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(express.json());

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
