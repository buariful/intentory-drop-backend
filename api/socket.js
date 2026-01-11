const { Server } = require('socket.io');

module.exports = function initSocket(server) {
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: ['https://sneaker-drop-frontend-gscv0uag8.vercel.app', 'http://localhost:5173'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 socket connected:', socket.id);

    socket.on('join:drop', (dropId) => {
      socket.join(`drop:${dropId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔴 socket disconnected:', socket.id);
    });
  });

  return io;
};
