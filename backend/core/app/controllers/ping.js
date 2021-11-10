const authenticationGuard = require('../guards/authentication');

function authentication() {
  return [
    authenticationGuard(),
    function(request, response) {
      return response.respond();
    }
  ];
}

function guest() {
  return [
    function(request, response) {
      return response.respond();
    }
  ];
}

module.exports = {
  authentication,
  guest
};
