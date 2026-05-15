const express = require('express');
const { Contact } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/admin/messages?page=1&limit=20&unread=true
router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = {};
    if (req.query.unread === 'true') filter.read = false;

    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);
    res.json({ messages, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/admin/messages/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json(msg);
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/admin/messages/:id/replied
router.patch('/:id/replied', async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { replied: true, read: true }, { new: true });
    res.json(msg);
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
