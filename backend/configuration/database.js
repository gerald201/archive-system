const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'archive_system',
    host: 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
};
