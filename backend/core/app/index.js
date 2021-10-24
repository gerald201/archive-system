const cors = require('cors');
const express = require('express');
const error = require('./error');
const fallback = require('./fallback');
const activityLogMiddleware = require('./middleware/activity-log');
const validatorMiddleware = require('./middleware/validator');
const router = require('./router');

const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

// Default Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Custom Middleware
app.use(activityLogMiddleware());
app.use(validatorMiddleware());

// Static Middleware
app.use('/assets', express.static('../../public'));
app.use('/storage', express.static('../../storage'));

router(app);
fallback(app);
error(app);

module.exports = app;
