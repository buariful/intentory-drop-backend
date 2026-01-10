const http = require('http');
const app = require('./app');
const initSocket = require('./socket');

const PORT = process.env.PORT || 3000;
let server;
let io;

module.exports = (req, res) => {
  console.log('🔥 Initializing server');
  if (!server) {
    console.log('🔥 Initializing server');

    server = http.createServer(app);
    io = initSocket(server);

    app.set('io', io);
  }

  server.listen(PORT, () => {
    console.log(`🔥 Local server running at http://localhost:${PORT}`);
  });

  server.emit('request', req, res);
};
