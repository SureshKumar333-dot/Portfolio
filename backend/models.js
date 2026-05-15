const mongoose = require('mongoose');

// ─── Contact Message ───────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 100 },
  email:   { type: String, required: true, trim: true, lowercase: true },
  budget:  { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true, maxlength: 2000 },
  read:    { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, { timestamps: true });

// ─── Project ───────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  num:     { type: String, required: true },
  label:   { type: String, required: true },
  type:    { type: String, required: true },
  name:    { type: String, required: true },
  desc:    { type: String, required: true },
  tech:    [{ type: String }],
  large:   { type: Boolean, default: false },
  link:    { type: String, default: '#' },
  caseLink:{ type: String, default: '#' },
  order:   { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Admin ────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
const Project = mongoose.model('Project', projectSchema);
const Admin   = mongoose.model('Admin', adminSchema);

module.exports = { Contact, Project, Admin };
