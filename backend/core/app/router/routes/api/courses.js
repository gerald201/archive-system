const express = require('express');
const controller = require('../../../controllers/api/course');

const router = express.Router();

router
  .route('/count')
  .get(controller.count());

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
  .route('/obliterate/:id')
  .delete(controller.obliterate());

router
  .route('/restore/:id')
  .post(controller.restore());

router
  .route('/update/:id')
  .patch(controller.update());

router
  .route('/view/:id')
  .get(controller.view());

module.exports = router;
