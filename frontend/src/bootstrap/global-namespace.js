import { io } from 'socket.io-client';
import apiConfiguration from '@/configuration/api';

function main() {
  if(!('$G' in window)) window.$G = {};

  $G.socketClient = io(apiConfiguration.url, {
    extraHeaders: {'api-key': apiConfiguration.apiKey}
  });
}

export default main;
