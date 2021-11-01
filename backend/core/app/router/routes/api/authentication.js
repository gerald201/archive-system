const express = require('express');
const controller = require('../../../controllers/api/authentication');

const router = express.Router();

router
  .route('/refresh')
  .get(controller.refresh());

router
  .route('/sign-in')
  .post(controller.signIn());

router
  .route('/sign-out')
  .get(controller.signOut());

router
  .route('/whoami')
  .get(controller.whoami());

module.exports = router;
