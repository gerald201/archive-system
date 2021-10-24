const nodemailer = require('nodemailer');
const nodemailerConfig = require('../config/nodemailer');
const serverConfig = require('../config/server');

const currentConfig = nodemailerConfig[serverConfig.env] || nodemailerConfig.development;
const transport = nodemailer.createTransport(currentConfig);

async function sendMail(config) {
  await transport.sendMail(config);
}

module.exports = {sendMail};
