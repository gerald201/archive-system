const express = require('express');
const controller = require('../../controllers/ping');

const router = express.Router();

router
  .route('/authentication')
  .get(controller.authentication());

router
  .route('/guest')
  .get(controller.guest());

module.exports = router;
