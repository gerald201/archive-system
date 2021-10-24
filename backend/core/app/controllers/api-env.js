const apiEnvData = require('../../../resources/data/api-env');

function getData() {
  return [
    function(request, response, next) {
      const responseData = {
        title: 'API-ENV Data Retrieval Successful',
        message: 'API-ENV Data has been successfully retrieved.',
        data: !request.query.keys
        ?.toString?.() ? apiEnvData : request.query.keys
          .toString()
          .split(',')
          .map(function(key) {
            return [
              key,
              key
                .split('.')
                .reduce(function(accumulator, keySegment, index, keySegments) {
                  const data = accumulator
                    .find(function(accumulated) {
                      return accumulated?.name == keySegment;
                    });
                  
                  if(index == keySegments.length - 1) return data;

                  return data?.routes ?? [];
                }, apiEnvData)
            ];
          })
          .filter(function(entry) {
            return !!entry[1];
          })
          .reduce(function(accumulator, entry) {
            let currentData = null;

            entry[0]
              .split('.')
              .forEach(function(keySegment, index, keySegments) {
                if(index == keySegments.length - 1) {
                  if(keySegments.length == 1) accumulator.push(entry[1]);
                  else currentData.push(entry[1]);
                } else if(index == 0) {
                  const exists = accumulator
                    .some(function(accumulated) {
                      return accumulated?.name == keySegment;
                    });

                  if(!exists) accumulator.push({
                    name: keySegment,
                    routes: []
                  });

                  currentData = accumulator
                    .find(function(accumulated) {
                      return accumulated?.name == keySegment;
                    }).routes;
                } else {
                  const newIndex = currentData.push({
                    name: keySegment,
                    routes: []
                  }) - 1;
                  
                  currentData = currentData[newIndex].routes;
                }
              });
            return accumulator;
          }, [])
      };

      return response.send(responseData);
    }
  ];
}

module.exports = {
  getData
}