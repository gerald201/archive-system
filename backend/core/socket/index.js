const socketDotIO = require('socket.io');
const appCore = require('../app');
const serverCore = require('../server');
const events = require('./events');

const socket = socketDotIO(serverCore);

appCore.locals.socketCore = socket;

events(socket);

module.exports = socket;
