require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const ColorGrade = require('./models/ColorGrade');
const SiteSettings = require('./models/SiteSettings');
const Inquiry = require('./models/Inquiry');

const sampleSettings = {
  name: 'Asif Raza',
  roleTitle: 'Video Editor & Colorist',
  experienceYears: '2+',
  experienceLabel: 'Years Experience',
  projectsDone: '50+',
  projectsLabel: 'Projects Done',
  happyClients: '20+',
  clientsLabel: 'Happy Clients',
  portraitUrl: 'assets/portrait.png',
  cvUrl: 'assets/resume.pdf',
  bioHeading: 'Crafting High-Retention Visual Masterpieces for Next-Gen Creators & Brands',
  bioText: 'I am Asif Raza, a passionate Video Editor and Colorist specializing in high-velocity storytelling, YouTube long-form pacing, viral short-form retention, and Hollywood-grade DaVinci Resolve color science. I take raw, flat LOG camera profiles and sculpt them into immersive, emotion-driven cinematic stories that capture attention within the first 3 seconds.',
  email: 'asif.raza.editor@gmail.com',
  phone: '+1 (555) 019-2834',
  location: 'Worldwide / Remote Available',
  socialLinks: {
    instagram: 'https://instagram.com/asifraza_edits',
    youtube: 'https://youtube.com/@asifraza_editor',
    linkedin: 'https://linkedin.com/in/asifraza-editor',
    behance: 'https://behance.net/asifraza',
  },
};

const sampleProjects = [
  {
    title: 'Neon Drift — Cyberpunk Night Commercial',
    category: 'commercial',
    categoryLabel: 'Commercial / YouTube',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Clean embed URL (swappable)
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    client: 'HyperPulse Energy Drinks',
    metrics: '3.4M+ Global Impressions',
    description: 'High-octane commercial edit with fast-paced cuts, beat-synced sound design, neon glow isolation, and stylized speed ramps.',
    softwareUsed: ['DaVinci Resolve Studio', 'Premiere Pro', 'After Effects'],
    featured: true,
    order: 1,
  },
  {
    title: 'Peak Performance — 9:16 Viral Gym Series',
    category: 'reels',
    categoryLabel: 'Reels & Shorts',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    client: 'Apex Athlete Media',
    metrics: '1.8M Views • 14% Engagement',
    description: 'Hook-driven 9:16 short-form video edit engineered for 85%+ retention rate, kinetic typography, dynamic zoom cuts, and punchy SFX.',
    softwareUsed: ['Premiere Pro', 'After Effects'],
    featured: true,
    order: 2,
  },
  {
    title: 'Nomad Chronicles: Iceland in 6K RAW',
    category: 'youtube',
    categoryLabel: 'Commercial / YouTube',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    client: 'Lost Horizon Travel Channel',
    metrics: '850K Views • 48 min Pacing',
    description: 'Documentary style long-form editing featuring seamless B-roll transitions, ambient Foley sound design, and rich emotional pacing.',
    softwareUsed: ['DaVinci Resolve Studio', 'Audition'],
    featured: true,
    order: 3,
  },
  {
    title: 'Elysian — Cinematic Narrative Short Film',
    category: 'grading',
    categoryLabel: 'Color Grading',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    client: 'Aurora Independent Films',
    metrics: 'Official Selection Cannes Indie 2025',
    description: 'Full ACES color science workflow, Kodak 2383 35mm film emulation, highlight roll-off soft clip, and natural skin tone balancing.',
    softwareUsed: ['DaVinci Resolve Studio 19', 'Dehancer Pro'],
    featured: true,
    order: 4,
  },
  {
    title: 'Tech Unboxed — Apple Ecosystem 2026',
    category: 'youtube',
    categoryLabel: 'Commercial / YouTube',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    client: 'Silicon Pulse (2.1M Subs)',
    metrics: '920K Views in 48 Hours',
    description: 'Sleek motion graphics, picture-in-picture tracking, 3D title animations, and micro-animations to retain viewer attention.',
    softwareUsed: ['Premiere Pro', 'After Effects', 'Fusion'],
    featured: false,
    order: 5,
  },
  {
    title: 'Urban Rhythm — Streetwear Summer Drop',
    category: 'reels',
    categoryLabel: 'Reels & Shorts',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop',
    client: 'KINETIC Apparel',
    metrics: '2.5M Views on TikTok & Reels',
    description: 'Rhythm-matched transitions, speed ramping, chromatic aberration accents, and bold streetwear aesthetic grading.',
    softwareUsed: ['Premiere Pro', 'DaVinci Resolve'],
    featured: false,
    order: 6,
  },
];

const sampleColorGrades = [
  {
    title: 'Golden Hour Mountain Drama — ARRI Alexa Mini LF',
    category: 'Narrative Film',
    beforeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop&sat=-100&con=-20&bri=15', // RAW LOG look
    afterImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop', // Rich graded look
    cameraProfile: 'ARRI LogC3 / Alexa Wide Gamut',
    software: 'DaVinci Resolve Studio 19',
    lookNotes: 'Transformed flat ARRI LogC3 footage into warm golden amber sunset tones with Kodak 2383 D65 print film emulation, clean cyan sky separation, and compressed highlight roll-off.',
    featured: true,
    order: 1,
  },
  {
    title: 'Tokyo Midnight Moody Neon — Sony FX3',
    category: 'Commercial / Music Video',
    beforeImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop&sat=-90&con=-15&bri=10', // RAW LOG look
    afterImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop', // Graded look
    cameraProfile: 'Sony S-Log3 / S-Gamut3.Cine',
    software: 'DaVinci Resolve Studio 19',
    lookNotes: 'De-noised in temporal node, mapped S-Log3 to Rec.709 with custom contrast S-curve. Isolated neon magentas and cyans while preserving natural skin tones with 3D qualifiers.',
    featured: true,
    order: 2,
  },
  {
    title: 'Desert Mirage Fashion Editorial — RED V-Raptor 8K',
    category: 'Fashion Campaign',
    beforeImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop&sat=-95&con=-25&bri=20',
    afterImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
    cameraProfile: 'RED IPP2 / REDWideGamutRGB',
    software: 'DaVinci Resolve Studio 19',
    lookNotes: 'Crafted a warm, nostalgic bleach-bypass inspired palette with subtle 35mm halation on high-contrast edges and fine film grain texture.',
    featured: true,
    order: 3,
  },
];

const sampleInquiries = [
  {
    name: 'Marcus Vance',
    email: 'marcus@aurorastudios.co',
    projectType: 'Commercial / Brand Video',
    budget: '$1,500 - $3,000',
    message: 'We are launching a new fitness tech product next month and need a 60-second high-energy hype promo plus 4 cutdowns for TikTok/Instagram Reels. Loved your color grading work on Neon Drift!',
    status: 'new',
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asif_portfolio';

  console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}...`);
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');

    // Clear existing
    await Project.deleteMany({});
    await ColorGrade.deleteMany({});
    await SiteSettings.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('Previous records cleared.');

    // Insert seeds
    await SiteSettings.create(sampleSettings);
    await Project.insertMany(sampleProjects);
    await ColorGrade.insertMany(sampleColorGrades);
    await Inquiry.insertMany(sampleInquiries);

    console.log('✅ Seed completed successfully!');
    console.log(`- Site Settings: initialized`);
    console.log(`- Projects: ${sampleProjects.length} seeded`);
    console.log(`- Color Grades: ${sampleColorGrades.length} seeded`);
    console.log(`- Inquiries: ${sampleInquiries.length} seeded`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  sampleSettings,
  sampleProjects,
  sampleColorGrades,
  sampleInquiries,
  seedDatabase,
};

