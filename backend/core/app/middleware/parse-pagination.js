function main() {
  return [
    function(request, response, next) {
      request.parsePagination = function(jsonString) {
        try {
          const data = JSON.parse(jsonString);

          if(!data || typeof data != 'object' || Array.isArray(data)) return {
            limit: null,
            offset: null
          };

          data.page = (data.page && !isNaN(data.page)) || typeof data.page == 'number' ? parseInt(data.page) : 0;
          data.size = (data.size && !isNaN(data.size)) || typeof data.size == 'number' ? parseInt(data.size) : 0;

          return {
            limit: (data.page > 0 && data.size > 0) ? data.size : null,
            offset: (data.page > 0 && data.size > 0) ? (data.page - 1) * data.size : null
          };
        } catch(error) {
          return {
            limit: null,
            offset: null
          };
        }
      }

      return next();
    }
  ];
}

module.exports = main;
