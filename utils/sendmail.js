const nodemailer = require('nodemailer')
require('dotenv').config({
  path: './../.env'
})

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  const mailOptions = {
    from: 'David Bodunrin <hello@david.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  return await transport.sendMail(mailOptions)
}

module.exports = sendEmail
