function main(socket) {
  socket.on('connection', function(client) {
    client.on('api:projects:counted', function(projectCount) {
      client.broadcast.emit('re:api:projects:counted', projectCount);
    });

    client.on('api:question-banks:counted', function(questionBankCount) {
      client.broadcast.emit('re:api:question-banks:counted', questionBankCount);
    });

    client.on('api:students:counted', function(studentCount) {
      client.broadcast.emit('re:api:students:counted', studentCount);
    });

    client.on('api:students:created', function(student) {
      client.broadcast.emit('re:api:students:created', student);
    });

    client.on('api:students:destroyed', function(student) {
      client.broadcast.emit('re:api:students:destroyed', student);
    });

    client.on('api:students:obliterated', function(student) {
      client.broadcast.emit('re:api:students:obliterated', student);
    });

    client.on('api:students:restored', function(student) {
      client.broadcast.emit('re:api:students:restored', student);
    });

    client.on('api:students:updated', function(student) {
      client.broadcast.emit('re:api:students:updated', student);
    });

    client.on('app:cache', function(data) {
      client.broadcast.emit('re:app:cache', data);
    });
  });
}

module.exports = main;
