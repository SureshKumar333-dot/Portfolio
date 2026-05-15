/**
 * SEED SCRIPT — run once after first deploy to populate projects in MongoDB
 * Usage: node seed-projects.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Project } = require('./models');

const projects = [
  {
    num: '01', order: 1, large: true, visible: true,
    label: '// HR Dashboard · UI/UX Design',
    type: 'Dashboard · HR Tech · UI Design',
    name: 'HR Dashboard',
    desc: 'A comprehensive HR management dashboard UI — clean data visualisation, employee overview panels, and an intuitive navigation system designed for real-world HR workflows.',
    tech: ['Figma', 'UI Design', 'Dashboard', 'Data Viz'],
    link: 'https://www.behance.net/gallery/232681035/HR-Dashboard',
    caseLink: 'https://www.behance.net/gallery/232681035/HR-Dashboard',
    thumb: 'https://mir-s3-cdn-cf.behance.net/projects/404/a127b3232681035.Y3JvcCwxNDI4LDExMTcsMTQ4LDA.png',
    source: 'behance',
  },
  {
    num: '02', order: 2, large: false, visible: true,
    label: '// Mobile App · UX Case Study',
    type: 'Mobile · Pet Care · UX Case Study',
    name: 'Pet Care & Habits Tracking App',
    desc: 'End-to-end UI/UX case study for a pet care and habits tracking mobile app. Covers user research, journey mapping, wireframes, and high-fidelity prototype.',
    tech: ['Figma', 'UX Research', 'Prototyping', 'Mobile UI'],
    link: 'https://www.behance.net/gallery/220615361/Pet-care-habits-tracking-app-UIUx-case-study',
    caseLink: 'https://www.behance.net/gallery/220615361/Pet-care-habits-tracking-app-UIUx-case-study',
    thumb: 'https://mir-s3-cdn-cf.behance.net/projects/404/687b79220615361.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    source: 'behance',
  },
  {
    num: '03', order: 3, large: false, visible: true,
    label: '// Website · Social Impact',
    type: 'Web Design · Social Care · UI',
    name: 'Social Care Website',
    desc: 'A clean, empathy-driven website design for a social care organisation — clear information hierarchy, accessible layouts, and a warm, trustworthy visual language.',
    tech: ['Figma', 'Web Design', 'UI Design', 'Accessibility'],
    link: 'https://www.behance.net/gallery/217266073/social-care-website',
    caseLink: 'https://www.behance.net/gallery/217266073/social-care-website',
    thumb: 'https://mir-s3-cdn-cf.behance.net/projects/404/1532c2217266073.Y3JvcCwxMjgwLDEwMDEsMCwyMTI.png',
    source: 'behance',
  },
  {
    num: '04', order: 4, large: false, visible: true,
    label: '// Mobile App · Food Tech',
    type: 'Mobile · Food Delivery · UI Design',
    name: 'Food Delivery App',
    desc: 'High-fidelity UI design for a food delivery mobile app. Smooth ordering flow, real-time tracking screens, and a bold visual system built for appetite appeal.',
    tech: ['Figma', 'Mobile UI', 'Food Tech', 'Interaction Design'],
    link: 'https://www.behance.net/gallery/216973583/Food-Delivery-app',
    caseLink: 'https://www.behance.net/gallery/216973583/Food-Delivery-app',
    thumb: 'https://mir-s3-cdn-cf.behance.net/projects/404/d2873c216973583.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png',
    source: 'behance',
  },
  {
    num: '05', order: 5, large: false, visible: true,
    label: '// Web Dev · JavaScript',
    type: 'Frontend · JavaScript · HTML/CSS',
    name: 'Coffee Shop Website',
    desc: 'A fully responsive coffee shop website built with vanilla JavaScript, HTML and CSS — smooth animations, a menu section, gallery, and contact form.',
    tech: ['JavaScript', 'HTML', 'CSS', 'Responsive Design'],
    link: 'https://github.com/SureshKumar333-dot/coffee-shop',
    caseLink: 'https://github.com/SureshKumar333-dot/coffee-shop',
    source: 'github',
  },
  {
    num: '06', order: 6, large: false, visible: true,
    label: '// Web Dev · CSS Animations',
    type: 'Frontend · CSS · Animation',
    name: 'Slide Animation',
    desc: 'A creative CSS slide animation project showcasing smooth transitions, keyframe animations, and modern CSS techniques applied to an interactive UI.',
    tech: ['CSS', 'HTML', 'Animations', 'Keyframes'],
    link: 'https://github.com/SureshKumar333-dot/Slide-animation',
    caseLink: 'https://github.com/SureshKumar333-dot/Slide-animation',
    source: 'github',
  },
  {
    num: '07', order: 7, large: false, visible: true,
    label: '// Web Dev · Freelance',
    type: 'Frontend · Freelancer Website · CSS',
    name: 'Freelancer Website',
    desc: 'A personal freelancer portfolio website — clean layout, services section, portfolio grid, and contact form, built with HTML and CSS.',
    tech: ['CSS', 'HTML', 'Portfolio', 'Web Design'],
    link: 'https://github.com/SureshKumar333-dot/Freelancer-Website',
    caseLink: 'https://github.com/SureshKumar333-dot/Freelancer-Website',
    source: 'github',
  },
  {
    num: '08', order: 8, large: false, visible: true,
    label: '// Mobile App · Japanese Food',
    type: 'Mobile · Sushi Delivery · UI Design',
    name: 'Sushi Delivery App',
    desc: 'Elegant mobile UI for a sushi delivery app — dark theme, immersive food photography layouts, smooth cart flow, and a refined Japanese-inspired visual style.',
    tech: ['Figma', 'Mobile UI', 'Food Tech', 'Dark Theme'],
    link: 'https://www.behance.net/gallery/217265569/Sushi-delivery-app',
    caseLink: 'https://www.behance.net/gallery/217265569/Sushi-delivery-app',
    thumb: 'https://mir-s3-cdn-cf.behance.net/projects/404/d1ecab217265569.Y3JvcCwxMDgwLDg0NCwwLDExNw.png',
    source: 'behance',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  MongoDB connected');

    const existing = await Project.countDocuments();
    if (existing > 0) {
      console.log(`⚠️   ${existing} projects already exist. Skipping seed.`);
      console.log('    Delete all projects first if you want to re-seed.');
      process.exit(0);
    }

    await Project.insertMany(projects);
    console.log(`✅  Seeded ${projects.length} projects successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
