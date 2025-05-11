const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure your SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // e.g., smtp.gmail.com
  port: 465, // or 587
  secure: true, // true for 465, false for 587
  auth: {
    user: 'your@email.com',
    pass: 'your_email_password_or_app_password'
  }
});

// Email endpoint
app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const info = await transporter.sendMail({
      from: '"MultiTool Sender" <your@email.com>',
      to,
      subject,
      html: `<p>${message}</p>`
    });

    console.log('Email sent:', info.messageId);
    res.send('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
