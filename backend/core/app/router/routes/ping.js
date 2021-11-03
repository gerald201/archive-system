const express = require('express');
const controller = require('../../controllers/ping');

const router = express.Router();

router
  .route('/')
  .get(controller.index());

module.exports = router;
