function index() {
  return [
    function(request, response, next) {
      return response.respond();
    }
  ];
}

module.exports = {
  index
};
