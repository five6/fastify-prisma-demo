import nodemailer from 'nodemailer'

import { MAIL_CONF } from '../common/config.js'


export default async function (fastify, options) {
  // /**
  //  * 通过传入的出参数，返回transport
  //  * @param host
  //  * @param user
  //  * @param port
  //  * @param pass
  //  * @param from
  //  * @param to
  //  * @param subject
  //  * @param text
  //  * @param html
  //  * @param data
  //  * @returns {Promise<void>}
  //  */
  // this.sendMail = async function sendMail({ host, port, user, pass }, { from, to, subject, text, html }) {
  //   const transporter = nodemailer.createTransport({
  //     secure: true,
  //     host: host || MAIL_CONF.host,
  //     port: port || MAIL_CONF.port,
  //     auth: { user: user || MAIL_CONF.user, pass: pass || MAIL_CONF.pass },
  //   });

  //   const result = await transporter.sendMail({
  //     from: from, // sender address
  //     to: to, // list of receivers
  //     subject: subject, // Subject line
  //     text: text, // plain text body
  //     html: html, // html body
  //   });

  //   console.log("Message sent: %s", result.messageId);

  // }
}