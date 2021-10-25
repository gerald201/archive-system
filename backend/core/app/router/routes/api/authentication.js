const express = require('express');
const apiAuthenticationController = require('../../../controllers/api/authentication');

const router = express.Router();

router
  .route('/refresh')
  .get(apiAuthenticationController.refresh());

router
  .route('/sign-in')
  .post(apiAuthenticationController.signIn());

router
  .route('/sign-out')
  .get(apiAuthenticationController.signOut());

router
  .route('/whoami')
  .get(apiAuthenticationController.whoami());

module.exports = router;
