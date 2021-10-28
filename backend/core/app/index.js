const cors = require('cors');
const express = require('express');
const error = require('./error');
const fallback = require('./fallback');
const activityLogMiddleware = require('./middleware/activity-log');
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

// Static Middleware
app.use('/assets', express.static('../../public'));
app.use('/uploads', express.static('../../storage/uploads'));

router(app);
fallback(app);
error(app);

module.exports = app;
