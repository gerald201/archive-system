const express = require('express');
const apiStudentController = require('../../../controllers/api/student');

const router = express.Router();

router
  .route('/')
  .get(apiStudentController.index());

router
  .route('/create')
  .post(apiStudentController.create());

module.exports = router;
