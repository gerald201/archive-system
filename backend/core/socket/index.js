const { Server: SocketServer } = require('socket.io');
const appCore = require('../app');
const serverCore = require('../server');
const events = require('./events');

function main() {
  const socket = new SocketServer(serverCore, {
    allowRequest(request, next) {
      if(request.headers['api-key'] != appCore.get('api-key')) return next('Invalid api key', false);

      return next(null, true);
    },
    cors: {origin: '*'}
  });

  events(socket);
  appCore.locals.socketCore = socket;
}

module.exports = main;
