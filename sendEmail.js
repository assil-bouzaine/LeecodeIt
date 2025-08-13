import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();
async function sendEmail(email, code) {
  // 1. Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD, // The 16-character app password you generated
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: process.env.USER_EMAIL,  // sender address
    to: email,                    // list of receivers (comma-separated)
    subject: 'Verification Code',              // Subject line
    text: code, // plain text body
    // html: '<b>This is a test email sent using Nodemailer!</b>' // optionally HTML body
  };

  // 3. Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
}

sendEmail().catch(console.error);

