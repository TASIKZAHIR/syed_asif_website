const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Asif Raza',
    },
    roleTitle: {
      type: String,
      default: 'Video Editor & Colorist',
    },
    experienceYears: {
      type: String,
      default: '2+ Years',
    },
    experienceLabel: {
      type: String,
      default: 'Experience',
    },
    projectsDone: {
      type: String,
      default: '50+',
    },
    projectsLabel: {
      type: String,
      default: 'Projects Done',
    },
    happyClients: {
      type: String,
      default: '20+',
    },
    clientsLabel: {
      type: String,
      default: 'Happy Clients',
    },
    portraitUrl: {
      type: String,
      default: 'assets/portrait.png',
    },
    cvUrl: {
      type: String,
      default: 'assets/resume.pdf',
    },
    bioHeading: {
      type: String,
      default: 'Crafting High-Impact Visual Stories That Hook Audiences & Elevate Brands',
    },
    bioText: {
      type: String,
      default: 'I am Asif Raza, a passionate video editor and colorist dedicated to high-retention storytelling, seamless pacing, and Hollywood-grade color palettes. Armed with DaVinci Resolve Studio and Premiere Pro, I transform flat RAW/LOG footage into dynamic, emotion-driven visual spectacles for top creators, agencies, and brands worldwide.',
    },
    email: {
      type: String,
      default: 'asif.raza.editor@gmail.com',
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    location: {
      type: String,
      default: 'Worldwide / Remote Available',
    },
    socialLinks: {
      instagram: {
        type: String,
        default: 'https://instagram.com',
      },
      youtube: {
        type: String,
        default: 'https://youtube.com',
      },
      linkedin: {
        type: String,
        default: 'https://linkedin.com',
      },
      behance: {
        type: String,
        default: 'https://behance.net',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);

