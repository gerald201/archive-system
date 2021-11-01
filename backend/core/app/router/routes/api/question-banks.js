const express = require('express');
const controller = require('../../../controllers/api/question-bank');

const router = express.Router();

router
  .route('/create')
  .post(controller.create());
  
router
  .route('/destroy/:id')
  .delete(controller.destroy());

router
  .route('/')
  .get(controller.index());

router
  .route('/update/:id')
  .patch(controller.update());

router
  .route('/view/:id')
  .get(controller.view());

module.exports = router;
