const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required.' });

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/seed — run once to create the admin user (disable after first use)
router.post('/seed', async (req, res) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password)
    return res.status(400).json({ message: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.' });

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Admin already exists.' });

  const hashed = await bcrypt.hash(password, 12);
  await Admin.create({ email, password: hashed });
  res.json({ success: true, message: 'Admin created. Disable this route now.' });
});

module.exports = router;
