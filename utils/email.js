const nodemailer = require('nodemailer'); //libreria para hacer la conexion con servicio de correo
const pug = require('pug'); //libreria pug
const { htmlToText } = require('html-to-text'); //libreria convierte codigo html en codigo texto

//objeto
class Email {
  constructor(to) {
    this.to = to;
  }

  createTransport() {
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  //envia el correo
  async send(template, subject, emailData) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      emailData,
    });

    await this.createTransport().sendMail({
      from: 'soporte-app-reapair@gmail.',
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    });
  }

  //enviar un correo de bienvenida cuando crea la cuenta
  async sendWelcome(name) {
    await this.send('welcome', 'New account', { name });
  }

  //enviar un correo con cuando la reparacion cambia de status
  async sendStatusNoticiaCompleted(name) {
    await this.send('statusCompleted', 'status App-repairs', { name: name });
  }

  //enviar un correo cuando el servicio fue cancelado
  async sendStatusNoticiaCanceled() {
    await this.send('statusCanceled', 'status App-repairs', { name: name });
  }
}

module.exports = { Email };
