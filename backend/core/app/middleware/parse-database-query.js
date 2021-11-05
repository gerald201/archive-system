const models = require('../../../database/models');

function parseAttributes(data) {
  data = data?.constructor?.name?.toLowerCase() == 'object' ? data : (Array.isArray(data) ? {include: data} : (typeof data == 'string' ? {include: [data]} : {}));
  data.exclude = (Array.isArray(data?.exclude) ? data.exclude : (typeof data?.exclude == 'string' ? [options.exclude] : []));
  data.include = (Array.isArray(data?.include) ? data.include : (typeof data?.include == 'string' ? [data.include] : [])); 
  
  return (data.include.length || data.exclude.length) ? data : null;
}

function parseInclude(data) {
  return (Array.isArray(data) ? data : [data])
    .filter(function(subData) {
      return subData?.constructor?.name?.toLowerCase() == 'object' && subData.model in models || typeof subData == 'string' && subData in models;
    })
    .map(function(subData) {
      const attributesQueryData = parseAttributes(subData.attributes);
      const includeQueryData = parseInclude(subData.include);
      const orderQueryData = parseOrder(subData.order);
      const whereQueryData = parseWhere(subData.where);
      const result = {};

      result.model = typeof subData == 'string' ? models[subData] : models[subData.model];

      if(subData.as && typeof subData.as == 'string') result.as = subData.as;

      if(attributesQueryData) result.attributes = attributesQueryData;

      if(includeQueryData) result.include = includeQueryData;
      
      if(orderQueryData) result.order = orderQueryData;

      if(whereQueryData) result.where = whereQueryData;

      return result;
    });
}

function parseOrder(data) {
  const result = (Array.isArray(data) ? data : [data])
    .map(function(subData) {
      return (Array.isArray(subData) ? subData : [subData])
        .filter(function(param) {
          return param && typeof param == 'string' || param?.constructor?.name?.toLowerCase() == 'object' && param.model in models;
        })
        .filter(function(param) {
          if(param?.constructor?.name?.toLowerCase() == 'object') return true;

          const specialParamCheck = /^\$\$\w+$/.test(param);
          const specialParam = param.replace('$$', '');

          return !specialParamCheck || specialParam in models;
        })
        .map(function(param) {
          if(param?.constructor?.name?.toLowerCase() == 'object') {
            const result = {};

            result.model = models[param.model];

            if(param.as && typeof param.as == 'string') result.as = param.as;

            return result;
          }

          const specialParamCheck = /^\$\$\w+$/.test(param);
          const specialParam = param.replace('$$', '');

          if(specialParamCheck)  return models[specialParam];

          return param;
        });
      })
    .filter(function(subData) {
      return subData.length;
    });

  return result.length ? result : null;
}

function parseWhere(data) {
  if(data?.constructor?.name?.toLowerCase() != 'object') return data;

  const result = {};

  for(const key in data) {
    const specialKeyCheck = /^\$\$\w+$/.test(key);
    const specialKey = specialKeyCheck ? key.replace('$$', '') : key;
    const objectCheck = data[key] && typeof data[key] == 'object' && !Array.isArray(data[key]);

    if(specialKeyCheck && specialKey in models.Sequelize.Op) result[models.Sequelize.Op[specialKey]] = objectCheck ? parseWhere(data[key]) : data[key];
    else result[key] = objectCheck ? parseWhere(data[key]) : data[key];
  }

  return result;
}

function main() {
  return [
    function(request, response, next) {
      request.parseDatabaseQuery = function(type, jsonString) {
        try {
          const data = JSON.parse(jsonString);

          if(type == 'attributes') return parseAttributes(data);

          if(type == 'include') return parseInclude(data);
          
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
