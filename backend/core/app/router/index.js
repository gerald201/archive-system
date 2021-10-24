const fs = require('fs');
const path = require('path');

const routesDirectory = path.join(__dirname, 'routes');

function registerRouter(directory, app) {
  const currentDirectory = directory == routesDirectory ? '' : path.relative(routesDirectory, directory);
  
  fs.readdirSync(directory)
    .forEach(function(fileName) {
      if(fs.lstatSync(path.join(directory, fileName)).isDirectory()) {
        registerRouter(path.join(directory, fileName), app);
        return;
      }

      if(!fileName.endsWith('.js')) return;

      const routerPrefix = `${currentDirectory && '/' + currentDirectory}${fileName == 'index.js' ? '' : ('/' + fileName.replace(/\.js/, ''))}`;

      app.use(routerPrefix, require(path.join(directory, fileName)));
    });
}

function main(app) {
  registerRouter(routesDirectory, app);
}

module.exports = main;