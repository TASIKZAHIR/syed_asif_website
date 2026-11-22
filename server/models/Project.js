const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['reels', 'commercial', 'grading', 'youtube'],
      default: 'commercial',
    },
    categoryLabel: {
      type: String,
      default: 'Commercial / YouTube',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL (YouTube/Vimeo/MP4) is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
      trim: true,
    },
    client: {
      type: String,
      trim: true,
      default: 'Client Project',
    },
    metrics: {
      type: String,
      trim: true,
      default: '1.2M+ Views',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    softwareUsed: {
      type: [String],
      default: ['DaVinci Resolve', 'Premiere Pro'],
    },
    featured: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Project', ProjectSchema);

