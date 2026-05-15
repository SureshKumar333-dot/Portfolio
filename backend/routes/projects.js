const express = require('express');
const { Project } = require('../models');

const router = express.Router();

// GET /api/projects — public, returns visible projects sorted by order
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ visible: true }).sort({ order: 1 }).lean();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch projects.' });
  }
});

module.exports = router;
