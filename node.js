// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 465,
  secure: true,
  auth: {
    user: 'your@email.com',
    pass: 'your_app_password'
  }
});

app.post('/send-bulk-email', async (req, res) => {
  const { recipients, subject, message } = req.body;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).send('No recipients provided.');
  }

  const results = [];

  for (const email of recipients) {
    try {
      let info = await transporter.sendMail({
        from: '"MultiTool AI" <your@email.com>',
        to: email,
        subject,
        html: `<p>${message}</p>`
      });
      results.push(`Sent to ${email}`);
    } catch (err) {
      results.push(`Failed to send to ${email}`);
    }
  }

  res.send(results.join('\n'));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
