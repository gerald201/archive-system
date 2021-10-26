const multer = require('multer');

const handler = multer();

function main() {
  return [handler.none()];
}

module.exports = main;
