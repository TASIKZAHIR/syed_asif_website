const mongoose = require('mongoose');

const ColorGradeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Cinematic Grade',
      trim: true,
    },
    beforeImageUrl: {
      type: String,
      required: [true, 'RAW / LOG Before image URL is required'],
      trim: true,
    },
    afterImageUrl: {
      type: String,
      required: [true, 'Final Graded After image URL is required'],
      trim: true,
    },
    cameraProfile: {
      type: String,
      default: 'Sony S-Log3 / S-Gamut3.Cine',
      trim: true,
    },
    software: {
      type: String,
      default: 'DaVinci Resolve Studio 19',
      trim: true,
    },
    lookNotes: {
      type: String,
      default: 'Custom film print emulation curve with balanced skin tone warmth and deep cinematic shadows.',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ColorGrade', ColorGradeSchema);

