const express = require('express');
const { Project } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(auth);

// GET /api/admin/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 }).lean();
    res.json(projects);
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/projects
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
