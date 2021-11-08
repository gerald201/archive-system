function index() {
  return [
    function(request, response) {
      return response.respond();
    }
  ];
}

module.exports = {
  index
};
