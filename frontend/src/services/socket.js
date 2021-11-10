import { io } from 'socket.io-client';
import apiConfiguration from '@/configuration/api';

export function createSocketClient() {
  return new Promise(function(resolve, reject) {
    const socket = io(apiConfiguration.url, {
      extraHeaders: {'api-key': apiConfiguration.apiKey}
    });

    socket.on('connect', function(data) {
      resolve(socket);
    });

    socket.on('error', function(error) {
      socket.disconnect();
    });

    return resolve(socket);
  });
}

export default {createSocketClient};
