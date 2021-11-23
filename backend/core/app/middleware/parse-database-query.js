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

      if(attributesQueryData !== null) result.attributes = attributesQueryData;

      if(includeQueryData !== null) result.include = includeQueryData;
      
      if(orderQueryData !== null) result.order = orderQueryData;

      if(whereQueryData !== null) result.where = whereQueryData;

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

          const specialParamCheck = /^\$.+$/.test(param);
          const specialParam = param.replace('$', '');

          return !specialParamCheck || specialParam in models;
        })
        .map(function(param) {
          if(param?.constructor?.name?.toLowerCase() == 'object') {
            const result = {};

            result.model = models[param.model];

            if(param.as && typeof param.as == 'string') result.as = param.as;

            return result;
          }

          const specialParamCheck = /^\$.+$/.test(param);
          const specialParam = param.replace('$', '');

          if(specialParamCheck)  return models[specialParam];

          return param;
        });
      })
    .filter(function(subData) {
      return subData.length;
    });

  return result.length ? result : null;
}

function parseSequelizeFunction(data) {
  if(typeof data != 'string' || !(/^#\w+/.test(data))) return data;

  const functionName = data
    .split(/\s*\|\s*/)[0]
    .replace(/^#/, '');

  if(typeof models.connection[functionName] != 'function') return data;

  console.log('CONNECTION_FUNCTION_DATA', data);
  console.log('CONNECTION_FUNCTION', models.connection[functionName]);
  console.log('CONNECTION_FUNCTION_ARGS', data.replace(/^#\w+\s*\|\s*/, ''));

  const args = JSON.parse(data.replace(/^#\w+\s*\|\s*/, ''))
    .map(function(arg) {
      console.log('SEQUELIZE_FUNCTION_ARG', arg, parseWhere(arg));

      if(Array.isArray(arg) || arg?.constructor?.name?.toLowerCase() == 'object') return parseWhere(arg);

      return parseSequelizeFunction(arg);
    });

  return models.connection[functionName](...args);
}

function parseWhere(data) {
  const result = {};

  for(const key in data) {
    const opKey = /^\$.+$/.test(key) ? key.replace('$', '') : '';

    if(Array.isArray(data[key])) {
      if(opKey in models.Sequelize.Op) {
        result[models.Sequelize.Op[opKey]] = data[key]
          .map(function(d) {
            return d?.constructor?.name?.toLowerCase() == 'object' ? parseWhere(d) : parseSequelizeFunction(d);
          });
      } else {
        result[key] = data[key]
          .map(function(d) {
            return d?.constructor?.name?.toLowerCase() == 'object' ? parseWhere(d) : parseSequelizeFunction(d);
          });
      }
    } else if(data[key]?.constructor?.name?.toLowerCase() == 'object') {
      if(opKey in models.Sequelize.Op) result[models.Sequelize.Op[opKey]] = parseWhere(data[key]);
      else result[key] = parseWhere(data[key]);
    } else {
      if(opKey in models.Sequelize.Op) result[models.Sequelize.Op[opKey]] = parseSequelizeFunction(data[key]);
      else result[key] = parseSequelizeFunction(data[key]);
    }
  }

  console.log('PARSE_WHERE', result, data);

  return result;
}

function main() {
  return [
    function(request, response, next) {
      request.parseDatabaseQuery = function(type, jsonString) {
        try {
          if(type == 'where') console.log('PARSE_QUERY_RAW', jsonString)

          const data = JSON.parse(jsonString);

          console.log('PARSE_QUERY_PARSED', type, data)

          if(type == 'attributes') return parseAttributes(data);
          
          if(type == 'include') return parseInclude(data);

          if(type == 'order') return parseOrder(data);
          
          if(type == 'where') return parseWhere(data);

          return null;
        } catch(error) {
          if(type == 'where') console.log('PARSE_ERROR', type, error)
          return null;
        }
      }

      return next();
    }
  ];
}

module.exports = main;
