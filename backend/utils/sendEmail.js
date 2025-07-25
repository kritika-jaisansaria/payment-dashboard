const nodemailer = require('nodemailer');
console.log('Email user:', process.env.EMAIL_USER);
console.log('Email pass:', process.env.EMAIL_PASS ? '****' : 'Not set');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Important to throw so caller knows it failed
  }
};

module.exports = sendEmail;
