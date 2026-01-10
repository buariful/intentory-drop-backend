require('dotenv').config();

const http = require('http');
const app = require('./api/app');
const initSocket = require('./api/socket');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = initSocket(server);

app.set('io', io);

server.listen(PORT, () => {
  console.log(`🔥 Local server running at http://localhost:${PORT}`);
});
