import nodemailer from 'nodemailer';
const MAIL_HOST = process.env.MAIL_HOST as string;
const MAIL_USER = process.env.MAIL_USER as string;
const MAIL_PORT = process.env.MAIL_PORT as string;
const MAIL_PASS = process.env.MAIL_PASS as string;

export interface MailData {
  to: string | string[];
  type: 'html' | 'text',
  content: string;
  subject: string;
}

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  },
  port: Number(MAIL_PORT),
  tls: {
    rejectUnauthorized: true
  }
})

export const sendMail = async (data: MailData) => {
  const { to, content, type, subject } = data;
  try {
    await transport.sendMail({
      to, from: "hello@rifaaq.com", subject, html: type === 'html' ? content : `<p>${content}</p>`
    })
  } catch (error) {
    console.log(error);
  }
}

