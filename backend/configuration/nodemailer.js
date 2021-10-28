const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    service: 'gmail',
    auth: {
      user: 'absoluteaveofficial@gmail.com',
      pass: 'Qwerty1.'
    }
  },
  production: {
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  }
};
