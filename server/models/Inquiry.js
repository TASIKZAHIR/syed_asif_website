const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true,
    },
    projectType: {
      type: String,
      default: 'Video Editing',
      trim: true,
    },
    budget: {
      type: String,
      default: '$500 - $1,500',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Project details are required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', InquirySchema);

