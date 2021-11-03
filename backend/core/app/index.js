const cors = require('cors');
const express = require('express');
const path = require('path');
const apiKey = require('./api-key');
const error = require('./error');
const fallback = require('./fallback');
const activityLogMiddleware = require('./middleware/activity-log');
const parseDatabaseQueryMiddleware = require('./middleware/parse-database-query');
const parsePaginationMiddleware = require('./middleware/parse-pagination');
const respondMiddleware = require('./middleware/respond');
const router = require('./router');

const morgan = require('morgan');

const app = express();

apiKey(app);

// Development Middleware
app.use(morgan('dev'));

// Default Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Custom Middleware
app.use(activityLogMiddleware());
app.use(parseDatabaseQueryMiddleware());
app.use(parsePaginationMiddleware());
app.use(respondMiddleware());

// Static Middleware
app.use('/assets', express.static(path.join(__dirname, '../../public')));
app.use('/uploads', express.static(path.join(__dirname, '../../storage/uploads')));

router(app);
fallback(app);
error(app);

module.exports = app;
