const nodemailer = require('nodemailer');
const ContactModel = require('../models/contactModel');
const { contactEmailTemplate } = require('../views/emailTemplate');

// POST /api/contact  (public)
const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    // 1. Persist to DB
    await ContactModel.create({ name, email, message });
    const dateSubmitted = new Date().toLocaleString();

    // 2. Send email notification via Gmail App Password
    if (
      process.env.GMAIL_USER &&
      process.env.GMAIL_PASS &&
      process.env.GMAIL_PASS !== 'your_gmail_app_password_here'
    ) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Aditya Portfolio" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          replyTo: email,
          subject: `📦 [Portfolio Message] - ${name}`,
          html: contactEmailTemplate({ name, email, message, dateSubmitted }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent successfully for ${name}.`);
      } catch (mailErr) {
        console.error('Nodemailer error:', mailErr.message);
      }
    } else {
      console.log('Nodemailer skipped: Gmail credentials not fully configured in .env');
    }

    res.status(201).json({ success: true, message: 'Message submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/contact  (admin only)
const getAll = async (req, res) => {
  try {
    const rows = await ContactModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/contact/:id  (admin only)
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ContactModel.remove(id);
    if (!result) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/contact/reply  (admin only)
const sendReply = async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Recipient email (to), subject, and message are required' });
  }

  if (
    !process.env.GMAIL_USER ||
    !process.env.GMAIL_PASS ||
    process.env.GMAIL_PASS === 'your_gmail_app_password_here'
  ) {
    return res.status(500).json({ error: 'SMTP credentials not configured in backend .env' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Aditya Varshney" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reply email successfully sent to ${to}`);
    res.json({ success: true, message: 'Reply sent successfully via SMTP' });
  } catch (error) {
    console.error('Nodemailer reply error:', error.message);
    res.status(500).json({ error: `Nodemailer error: ${error.message}` });
  }
};

module.exports = { submitContact, getAll, remove, sendReply };
