const cluster = require('cluster');
const os = require('os');

function main(callback) {
  if(cluster.isMaster) {
    for(let iteration = 0; iteration < os.cpus().length; iteration++) {
      cluster.fork();
    }

    cluster.on('exit', function() {
      cluster.fork();
    });
    return;
  }

  callback?.();
}

module.exports = main;
