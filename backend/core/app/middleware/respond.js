const successMessageMap = require('../../../resources/data/success-message-map');

function main() {
  return [
    function(request, response, next) {
      response.respond = function(options) {
        const name = successMessageMap.hasOwnProperty(options?.name?.toString() ?? '') ? options.name : 'Success';
        const messageData = successMessageMap[name];

        return response
          .status(messageData.status)
          .send({
            title: name
              .replace(/([A-Z])/, ' $1')
              .trim(),
            message: messageData.message,
            data: options?.data ?? null
          });
      }

      return next();
    }
  ];
}

module.exports = main;
