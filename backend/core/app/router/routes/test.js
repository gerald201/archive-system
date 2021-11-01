const express = require('express');
const validationGuard = require('../../guards/validation');

const router = express.Router();

router
  .route('/')
  .get([
    validationGuard({
      file: {
        handler: 'single',
        destination: 'test',
        schema: {
          file: {
            extensions: 'pdf',
            size: '10m'
          }
        }
      }
    }),
    function(request, response, next) {
      return response.respond({data: request.file});
    }
  ]);

module.exports = router;
