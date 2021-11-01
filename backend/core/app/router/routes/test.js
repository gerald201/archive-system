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
            size: '1m'
          }
        }
      }
    }),
    function(request, response, next) {
      return response.send({
        title: 'Test Successful.',
        message: 'Test has been successfully executed.',
        data: request.file
      });
    }
  ]);

module.exports = router;
