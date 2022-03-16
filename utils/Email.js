const pug = require('pug')
const nodemailer = require('nodemailer')
const htmlToText = require('html-to-text')

class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0]
    this.to = user.email
    this.url = url
    this.from = `Bodunrin David ${process.env.EMAIL_FROM}`
  }

  transport() {
    if (process.env.NODE_ENV === 'production') {
      //   send grid
      return 1
    }

    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })
  }

  async send(template, subject) {
    // 1, render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject: this.subject
      }
    )

    // 2 define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html)
    }

    // 3, send email
    return await this.transport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Movies App ! 🎈🎊')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      '📌 Reset your password (Password reset token expires after 10 minutes)'
    )
  }
}

module.exports = Email
