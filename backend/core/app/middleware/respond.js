const successMessageMap = require('../../../resources/data/success-message-map');

function main() {
  return [
    function(request, response, next) {
      response.respond = function(options) {
        const name = (options?.name?.toString() ?? '') in successMessageMap ? options.name : 'Success';
        const messageData = successMessageMap[name];

        return response
          .status(messageData.status)
          .send({
            title: name
              .replace(/([A-Z])/, ' $1')
              .trim(),
            message: messageData.message,
            payload: options?.payload ?? null
          });
      }

      return next();
    }
  ];
}

module.exports = main;
