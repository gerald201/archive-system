const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const fileSizeValueMap = require('../../../resources/data/file-size-value-map');
const mimetypeMap = require('../../../resources/data/mimetype-map');
const { validate: validateBody } = require('../../../services/fastest-validator');

const rootDestination = path.join(__dirname, '../../../storage/uploads');
const handlers = [
  'any',
  'array',
  'fields',
  'single'
];
const fileSizeLimit = /^(\d+)(\w)?$/
  .exec('50m')
  .filter(function(match, index) {
    return index > 0;
  })
  .reduce(function(accumulator, match) {
    return accumulator * (isNaN(parseInt(match)) ? (fileSizeValueMap[match] || 0) : parseInt(match));
  }, 1);

function filterFileType(file, schemaRule) {
  if(schemaRule.name != file.fieldname) return true;

  const fileExtension = path
    .extname(file.originalname)
    .replace('.', '');
  const extensionsCheck = !schemaRule.extensions.length || schemaRule.extensions.includes(fileExtension);
  const mimetypeCheck = !schemaRule.mimetypes.length || schemaRule.mimetypes
    .some(function(mimetype) {
      return (new RegExp(mimetype, 'gi')).test(file.mimetype);
    });

  return extensionsCheck || mimetypeCheck;
}

function validateFileRequired(file, schemaRule, isArray = false) {
  if(schemaRule.optional !== true && (!file || isArray && !file?.length)) {
    return {
      type: 'fileRequired',
      message: `The '${schemaRule.name}' field is required.`,
      field: schemaRule.name
    };
  }

  return true;
}

function validateFileSize(file, schemaRule, isArray = false) {
  if(!file) return true;

  if(isArray) {
    const preppedFiles = file
      .filter(function(preppedFile) {
        return preppedFile.name != schemaRule.name;
      });

    if(!preppedFiles.length) return true;

    return preppedFiles
      .every(function(preppedFile) {
        return schemaRule.size <= 0 || preppedFile.size <= schemaRule.size;
      });
  }

  if(schemaRule.name != file.fieldname) return true;

  return schemaRule.size <= 0 || file.size <= schemaRule.size;
}

function validateFileType(file, schemaRule, isArray = false) {
  if(!file) return true;

  if(isArray) {
    const preppedFiles = file
      .filter(function(preppedFile) {
        return preppedFile.name != schemaRule.name;
      });

    if(!preppedFiles.length) return true;

    return preppedFiles
      .every(function(preppedFile) {
        const fileExtension = path
          .extname(preppedFile.originalname)
          .replace('.', '');
        const extensionsCheck = !(schemaRule.extensions.length || schemaRule.mimetypes.length) || schemaRule.extensions.includes(fileExtension);
        const mimetypeCheck = !(schemaRule.extensions.length || schemaRule.mimetypes.length) || schemaRule.mimetypes
          .some(function(mimetype) {
            return (new RegExp(mimetype, 'gi')).test(preppedFile.mimetype);
          });

        return (extensionsCheck || mimetypeCheck) || {
          type: 'fileType',
          message: `The '${schemaRule.name}' field must have a valid file type.`,
          field: schemaRule.name
        };
      });
  }

  if(schemaRule.name != file.fieldname) return true;

  const fileExtension = path
    .extname(file.originalname)
    .replace('.', '');
  const extensionsCheck = !(schemaRule.extensions.length || schemaRule.mimetypes.length) || schemaRule.extensions.includes(fileExtension);
  const mimetypeCheck = !(schemaRule.extensions.length || schemaRule.mimetypes.length) || schemaRule.mimetypes
    .some(function(mimetype) {
      return (new RegExp(mimetype, 'gi')).test(file.mimetype);
    });

  return (extensionsCheck || mimetypeCheck) || {
    type: 'fileType',
    message: `The '${schemaRule.name}' field must have a valid file type.`,
    field: schemaRule.name
  };
}

function validateFile(handler, request, schema) {
  if(!schema.length) return true;

  const errors = [];

  if(handler == 'array') {
    const individualErrors = [
      validateFileRequired(request.files, schema[0], true),
      validateFileSize(request.files, schema[0], true),
      validateFileType(request.files, schema[0], true)
    ]
      .filter(function(error) {
        return error !== true;
      });

    if(individualErrors.length) {
      request.files
        ?.forEach(function(file) {
          if(typeof file?.path == 'string') fs.unlink(file.path, function(error) {});
        });
      
      errors.push(...individualErrors);
    }
  } else if(handler == 'fields') {
    const fieldNames = schema
      .map(function(rule) {
        return rule.name;
      });

    for(const key of fieldNames) {
      const schemaRule = schema
        .find(function(rule) {
          return rule.name == key;
        });
      const individualErrors = [
        validateFileRequired(request.files?.[key], schemaRule),
        validateFileSize(request.files?.[key], schemaRule),
        validateFileType(request.files?.[key], schemaRule)
      ]
        .filter(function(error) {
          return error !== true;
        });

      if(individualErrors.length) {
        if(typeof request.files?.[key]?.path == 'string') fs.unlink(request.files[key].path, function(error) {});
        
        errors.push(...individualErrors);
      }
    }
  } else if(handler == 'single') {
    const individualErrors = [
      validateFileRequired(request.file, schema[0]),
      validateFileSize(request.file, schema[0]),
      validateFileType(request.file, schema[0])
    ]
      .filter(function(error) {
        return error !== true;
      });

    if(individualErrors.length) {
      if(typeof request.file?.path == 'string') fs.unlink(request.file.path, function(error) {});

      errors.push(...individualErrors);
    }
  }

  if(errors.length) return errors;

  return true;
}

function main(options) {
  const middleware = [];
  const fileOptions = {};
  const bodyOptions = {};
  const rawFileSchema = options?.file?.schema ? options.file.schema : {};

  bodyOptions.schema = options?.body?.schema ? options.body.schema : {};

  fileOptions.handler = handlers.includes(options?.file?.handler) ? options.file.handler : '';
  fileOptions.destination = typeof options?.file?.destination == 'string' ? path.join(rootDestination, options.file.destination) : null;
  fileOptions.schema = [];

  for(const field in rawFileSchema) {
    fileOptions.schema.push({
      name: field,
      maxCount: (!isNaN(parseInt(rawFileSchema[field].maxCount)) && parseInt(rawFileSchema[field].maxCount) > 0) ? parseInt(rawFileSchema[field].maxCount) : 1,
      extensions: (Array.isArray(rawFileSchema[field].extensions) ? rawFileSchema[field].extensions : (typeof rawFileSchema[field].extensions == 'string' ? [rawFileSchema[field].extensions] : []))
        .filter(function(extension) {
          return typeof extension == 'string' && extension in mimetypeMap;
        }),
      mimetypes: (Array.isArray(rawFileSchema[field].mimetypes) ? rawFileSchema[field].mimetypes : (typeof rawFileSchema[field].mimetypes == 'string' ? [rawFileSchema[field].mimetypes] : []))
        .filter(function(mimetype) {
          const allMimetypes = Object.values(mimetypeMap)
            .reduce(function(accumulator, current) {
              return accumulator.concat(current);
            }, []);
          
          return allMimetypes
            .some(function(someMimetype) {
              return (new RegExp(mimetype, 'gi')).test(someMimetype);
            });
        }),
        size: /^(\d+)(\w)?$/
          .exec(rawFileSchema[field].size?.toString() || '0')
          .filter(function(match, index) {
            return index > 0;
          })
          .reduce(function(accumulator, match) {
            return accumulator * (isNaN(parseInt(match)) ? (fileSizeValueMap[match] || 0) : parseInt(parseInt(match)));
          }, 1)
    });
  }

  const fileOptionsCheck = fileOptions.handler && fileOptions.destination && !(fs.existsSync(fileOptions.destination) && fs.lstatSync(fileOptions.destination).isFile() && (fileOptions.schema.length || fileOptions.handler == 'any'));

  if(fileOptionsCheck) {
    const multerInstance = multer({
      storage: multer.diskStorage({
        destination(request, file, next) {
          if(!fs.existsSync(fileOptions.destination)) fs.mkdirSync(fileOptions.destination);
  
          return next(null, fileOptions.destination);
        },
        filename(request, file, next) {
          const randomString = crypto
            .randomBytes(32)
            .toString('hex');
  
          return next(null, `${Date.now()}-${randomString}${path.extname(file.originalname)}`);
        }
      }),
      fileFilter(request, file, next) {
        const fileSchemaRule = fileOptions.schema
          .find(function(schemaRule) {
            return schemaRule.name == file.fieldname;
          });
  
        if(!fileSchemaRule) return next(null, false);
  
        const typeCheck = filterFileType(file, fileSchemaRule);
  
        if(!typeCheck) return next(null, false);
  
        return next(null, true);
      },
      limits: {fileSize: fileSizeLimit}
    });

    let args;

    switch(fileOptions.handler) {
      case 'array': {
        args = [
          fileOptions.schema[0].name,
          fileOptions.schema[0].maxCount
        ];
        break;
      }
      case 'fields': {
        args = [fileOptions.schema];
        break;
      }
      case 'single': {
        args = [fileOptions.schema[0].name];
        break;
      }
      default: {
        args = [];
        break;
      }
    }

    middleware.push(function(request, response, next) {
      multerInstance[fileOptions.handler](...args)(request, response, function() {
        return next();
      });
    });
  } else middleware.push(multer().any());

  return [
    ...middleware,
    function(request, response, next) {
      const validatedBody = validateBody(request.body, bodyOptions.schema);
      const validatedFile = fileOptions.schema.length ? validateFile(fileOptions.handler, request, fileOptions.schema) : true;

      if(validatedBody !== true || validatedFile !== true) {
        const validated = [
          validatedBody,
          validatedFile
        ]
          .filter(function(validatedItem) {
            return validatedItem !== true;
          })
          .reduce(function(accumulator, current) {
            return accumulator.concat(current);
          }, []);

        return next({
          name: 'RequestFormDataError',
          error: validated
        });
      }

      for(const key in request.body) {
        if(request.body[key] === undefined) delete request.body[key];
      }

      return next();
    }
  ];
}

module.exports = main;
