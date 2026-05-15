const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { Contact } = require('../models');

const router = express.Router();

// Rate limit: max 5 submissions per IP per hour
const contactLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// POST /api/contact
router.post(
  '/',
  contactLimit,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, budget, service, message } = req.body;

    try {
      // Save to MongoDB
      const contact = await Contact.create({ name, email, budget, service, message });

      // Send notification email
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New inquiry from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0A0A0A;color:#F0EBE0;padding:40px;border:1px solid rgba(200,168,75,0.2);">
            <h2 style="color:#C8A84B;margin-bottom:24px;">New Portfolio Inquiry</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#8B6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#8B6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#C8A84B;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#8B6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Budget</td><td style="padding:8px 0;">${budget || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#8B6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Service</td><td style="padding:8px 0;">${service || '—'}</td></tr>
            </table>
            <div style="margin-top:24px;padding:20px;background:#111;border-left:2px solid #C8A84B;">
              <p style="color:#8B6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">Message</p>
              <p style="line-height:1.8;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top:24px;font-size:11px;color:#8B6914;">Submission ID: ${contact._id}</p>
          </div>
        `,
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: `"Your Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Got your message — talk soon.',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0A0A0A;color:#F0EBE0;padding:40px;border:1px solid rgba(200,168,75,0.2);">
            <h2 style="color:#C8A84B;">Message received, ${name}.</h2>
            <p style="line-height:1.9;color:rgba(240,235,224,0.7);margin-top:16px;">
              Thank you for reaching out. I've received your inquiry and will review it carefully.
              You can expect a reply within 24 hours.
            </p>
            <p style="line-height:1.9;color:rgba(240,235,224,0.7);">Looking forward to learning more about your project.</p>
            <p style="margin-top:32px;color:#C8A84B;">— Your Name</p>
          </div>
        `,
      });

      res.json({ success: true, message: 'Message sent successfully.' });
    } catch (err) {
      console.error('Contact error:', err);
      res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }
);

module.exports = router;
