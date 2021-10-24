const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'exlJCNwlQo',
    password: 'oTYpE3k3ca',
    database: 'exlJCNwlQo',
    host: '37.59.55.185',
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
