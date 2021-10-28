const nodemailer = require('nodemailer');
const nodemailerConfiguration = require('../configuration/nodemailer');
const serverConfiguration = require('../configuration/server');

const currentConfig = nodemailerConfiguration[serverConfiguration.env] || nodemailerConfiguration.development;
const transport = nodemailer.createTransport(currentConfig);

async function sendMail(config) {
  await transport.sendMail(config);
}

module.exports = {sendMail};
