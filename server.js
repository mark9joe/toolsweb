const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your frontend files from the "public" folder

// Configure your SMTP credentials (use environment variables for production)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Example: smtp.gmail.com
  port: 465,                // For secure: use port 465; for TLS: use port 587 (set secure accordingly)
  secure: true,             // true for port 465; false for other ports
  auth: {
    user: 'your@email.com',
    pass: 'your_email_password_or_app_password'
  }
});

app.post('/send-bulk-email', async (req, res) => {
  const { recipients, subject, message } = req.body;

  // Basic validation:
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).send('No valid recipients provided.');
  }

  // Prepare an array to hold results for each email send
  const results = [];

  // Send email to each recipient. This example sends them individually.
  // In production, you might wish to use a queue system or parallel requests with error handling.
  for (const email of recipients) {
    try {
      let info = await transporter.sendMail({
        from: '"MultiTool Bulk Sender" <your@email.com>',
        to: email,
        subject,
        html: `<p>${message}</p>`
      });
      console.log(`Email sent to ${email}: ${info.messageId}`);
      results.push(`Success: ${email}`);
    } catch (error) {
      console.error(`Error sending to ${email}:`, error);
      results.push(`Failed: ${email}`);
    }
  }

  // Respond with the aggregated results:
  res.send(results.join('\n'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
