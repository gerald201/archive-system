function main(socket) {
  socket.on('connection', function(client) {
    client.on('app:cache', function(data) {
      client.broadcast.emit('app:cache', data);
    });

    client.on('app:resource:create', function(data) {
      client.broadcast.emit('app:resource:create', data);
    });

    client.on('app:resource:update', function(data) {
      client.broadcast.emit('app:resource:update', data);
    });
  });
}

module.exports = main;
