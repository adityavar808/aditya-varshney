const { Resend } = require('resend');
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

    // 2. Send email notification via Resend HTTP API (works on Railway)
    if (process.env.RESEND_API_KEY && process.env.GMAIL_USER) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Aditya Portfolio <onboarding@resend.dev>',
          to: [process.env.GMAIL_USER],
          replyTo: email,
          subject: `📦 [Portfolio Message] - ${name}`,
          html: contactEmailTemplate({ name, email, message, dateSubmitted }),
        });
        console.log(`Notification email sent successfully for ${name}.`);
      } catch (mailErr) {
        console.error('Resend error:', mailErr.message);
      }
    } else {
      console.log('Email skipped: RESEND_API_KEY not configured in env');
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

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured in backend env' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Aditya Varshney <onboarding@resend.dev>',
      to: [to],
      subject,
      text: message,
    });
    console.log(`Reply email successfully sent to ${to}`);
    res.json({ success: true, message: 'Reply sent successfully via Resend' });
  } catch (error) {
    console.error('Resend reply error:', error.message);
    res.status(500).json({ error: `Resend error: ${error.message}` });
  }
};

module.exports = { submitContact, getAll, remove, sendReply };
