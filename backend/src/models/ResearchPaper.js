const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: [{
    type: String,
    required: true,
  }],
  year: {
    type: Number,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema); 