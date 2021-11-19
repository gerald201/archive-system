const express = require('express');
const controller = require('../../../controllers/api/level');

const router = express.Router();

router
  .route('/count')
  .get(controller.count());

router
  .route('/')
  .get(controller.index());

router
  .route('/view/:id')
  .get(controller.view());

module.exports = router;
