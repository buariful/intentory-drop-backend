const { Server } = require('socket.io');

module.exports = function initSocket(server) {
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: '*',
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
