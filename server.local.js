require('dotenv').config();

const http = require('http');
const app = require('./api/app');
const initSocket = require('./api/socket');
const { connectDB, sequelize } = require('./api/db');
require('./api/models');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = initSocket(server);

app.set('io', io);

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});

connectDB().then(async () => {
  await sequelize.sync({ alter: true });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
