const models = require('../../../database/models');

function parseAttributes(data) {
  if(!Array.isArray(data)) {
    if(data && typeof data == 'string') return [data];

    return null;
  }

  return data
    .filter(function(subData) {
      return subData && typeof subData == 'string';
    });
}

function parseOrder(data) {
  if(!Array.isArray(data)) {
    if(data && typeof data == 'string') return [data];

    return null;
  }

  return data
    .filter(function(subData) {
      return subData && typeof subData == 'string';
    });
}

function parseWhere(data) {
  if(!data || typeof data != 'object' || Array.isArray(data)) return data;

  const result = {};

  for(const key in data) {
    const specialKeyCheck = /^\$\$/.test(key);
    const specialKey = specialKeyCheck ? key.replace('$$', '') : key;
    const objectCheck = data[key] && typeof data[key] == 'object' && !Array.isArray(data[key]);

    if(specialKeyCheck && models.Sequelize.Op.hasOwnProperty(specialKey)) result[models.Sequelize.Op[specialKey]] = objectCheck ? parseWhere(data[key]) : data[key];
    else result[key] = objectCheck ? parseWhere(data[key]) : data[key];
  }

  return result;
}

function main() {
  return [
    function(request, response, next) {
      request.parseDbQuery = function(type, jsonString) {
        try {
          const data = JSON.parse(jsonString);

          if(type == 'attributes') return parseAttributes(data);

          if(type == 'order') return parseOrder(data);

          if(type == 'where') return parseWhere(data);

          return null;
        } catch(error) {
          return null;
        }
      }

      return next();
    }
  ];
}

module.exports = main;
